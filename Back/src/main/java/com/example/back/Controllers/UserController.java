package com.example.back.Controllers;

import com.example.back.Entities.Enums.UserRole;
import com.example.back.Entities.User;
import com.example.back.Entities.UserWrapper;
import com.example.back.ExceptionHandling.ApiResponse;
import com.example.back.SecurityConfig.KeycloakConfig;
import com.example.back.ServiceImp.UserLoginTrackingService;
import com.example.back.Services.UserService;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.keycloak.representations.idm.RoleRepresentation;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import static com.example.back.SecurityConfig.KeycloakConfig.keycloak;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/service/user")
@Slf4j
public class UserController {

    private final UserService userService ;
    private final UserLoginTrackingService loginTrackingService;


    //tested and using it in the front end
    @PreAuthorize("hasAnyAuthority('admin')")
    @PostMapping("/CreateUser")
    public ResponseEntity<ApiResponse> addUser(@RequestBody UserWrapper userWrapper) {
        Keycloak k = KeycloakConfig.getInstance();
        UserRepresentation userRep = userWrapper.getKeycloakUser();

        // Check if the user already exists in the database
        if (userService.existsByLogin(userRep.getUsername()) || userService.existsByLogin(userRep.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(false, "User already exists in the database", null));
        }

        try (Response response = k.realm("constructionRealm").users().create(userRep)) {
            if (response.getStatus() != Response.Status.CREATED.getStatusCode()) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ApiResponse(false, response.readEntity(String.class), null));
            } else {
                UserRepresentation userRepresentation = k.realm("constructionRealm").users().search(userRep.getUsername()).get(0);
                userService.assignRoles(userRepresentation.getId(), userRep.getRealmRoles());
                try {
                    User u = userService.addUser(userWrapper.getUser());
                    return ResponseEntity.ok(new ApiResponse(true, "User created successfully in Keycloak and database", u));
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.OK)
                            .body(new ApiResponse(false, e.getMessage(), null));
                }
            }
        }
    }


    @PutMapping("/UpdateUser")
    @PreAuthorize("hasAnyAuthority('admin', 'user')")
    public ResponseEntity<ApiResponse> updateUser(@RequestBody UserWrapper user) {
        try {
            User updatedUser = userService.UpdateUser(user.getUser());
            return ResponseEntity.ok(new ApiResponse(true, "User updated successfully in Keycloak and database", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Update Failed: " + e.getMessage(), null));
        }
    }
    @GetMapping("/getProfilePicture/{userId}")
    public ResponseEntity<String> getProfilePicture(@PathVariable String userId) {
        try {
            UserResource userResource = keycloak.realm("constructionRealm").users().get(userId);
            UserRepresentation userRepresentation = userResource.toRepresentation();

            // Retrieve the profile picture URL
            List<String> profilePictureList = userRepresentation.getAttributes().get("profile_picture");
            if (profilePictureList == null || profilePictureList.isEmpty()) {
                return ResponseEntity.ok("No profile picture set.");
            }

            return ResponseEntity.ok(profilePictureList.get(0)); // Return the stored image URL
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to retrieve profile picture: " + e.getMessage());
        }
    }
    @PreAuthorize("hasAnyAuthority('admin', 'user','chef_projet','ouvrier','architecte')")
    @PostMapping("/registerAllFromKeycloak")
    public ResponseEntity<ApiResponse> registerAllUsersFromKeycloak() {
        List<UserRepresentation> keycloakUsers = KeycloakConfig.getAllUsers();
        List<String> registeredUsers = new ArrayList<>();

        for (UserRepresentation keycloakUser : keycloakUsers) {
            String login = keycloakUser.getUsername();
            String email = keycloakUser.getEmail();
            String firstName = keycloakUser.getFirstName();
            String lastName = keycloakUser.getLastName();

            // Check if the user exists in the database by login or email
            if (!userService.existsByLogin(login) && !userService.existsByLogin(email)) {  // Assuming you have a method existsByEmail
                // Fetch roles from Keycloak
                List<String> roles = keycloak.realm("constructionRealm")
                        .users()
                        .get(keycloakUser.getId())
                        .roles()
                        .realmLevel()
                        .listAll()
                        .stream()
                        .map(RoleRepresentation::getName)
                        .collect(Collectors.toList());

                // Assign 'admin' or 'user' role dynamically
                String assignedRole = "user"; // Default
                if (roles.contains("admin")) assignedRole = "admin";
                else if (roles.contains("architecte")) assignedRole = "architecte";
                else if (roles.contains("chef_projet")) assignedRole = "chef_projet";
                else if (roles.contains("ouvrier")) assignedRole = "ouvrier";
                // Create and save the user with dynamic role
                User newUser = new User();
                newUser.setLogin(login);
                newUser.setEmail(email);
                newUser.setFirstName(firstName);
                newUser.setLastName(lastName);
                newUser.setRole(assignedRole); // Dynamically assigned

                userService.addUser(newUser);
                registeredUsers.add(login);
            }
        }

        return ResponseEntity.ok(new ApiResponse(true, "✅ Registered " + registeredUsers.size() + " users.", registeredUsers));
    }

    @PreAuthorize("hasAnyAuthority('admin', 'user','chef_projet','ouvrier','architecte')")

    @GetMapping("/GetUserByUserName/{username}")
    public ResponseEntity<ApiResponse> getUserByUserName(@PathVariable String username) {
        Keycloak k = KeycloakConfig.getInstance();
        UserWrapper userWrapper = new UserWrapper();

        // 1️⃣ Check if the user exists in the database
        User user = userService.GetUserByUserName(username);
        if (user != null) {
            userWrapper.setUser(user);
            return ResponseEntity.ok(new ApiResponse(true, "User found in database", userWrapper));
        }

        // 2️⃣ If not found in the database, check Keycloak
        List<UserRepresentation> keycloakUsers = k.realm("constructionRealm").users().search(username);
        if (!keycloakUsers.isEmpty()) {
            UserRepresentation keycloakUser = keycloakUsers.get(0);
            String keycloakUserId = keycloakUser.getId();

            // ✅ Retrieve user roles from Keycloak
            List<RoleRepresentation> roles = k.realm("constructionRealm")
                    .users()
                    .get(keycloakUserId)
                    .roles()
                    .realmLevel()
                    .listAll();

            // ✅ Determine role: Default to "user" unless "admin" is explicitly assigned
            String assignedRole = "user"; // Default role
            for (RoleRepresentation role : roles) {
                String roleName = role.getName().toLowerCase();
                if (roleName.equals("admin") || roleName.equals("architecte") ||
                        roleName.equals("chef_projet") || roleName.equals("ouvrier")) {
                    assignedRole = roleName;
                    break;
                }
            }


            User newUser = new User();
            newUser.setLogin(keycloakUser.getUsername());
            newUser.setEmail(keycloakUser.getEmail());
            newUser.setFirstName(keycloakUser.getFirstName());
            newUser.setLastName(keycloakUser.getLastName());
            newUser.setKeycloakId(keycloakUserId);
            newUser.setRole(assignedRole); // ✅ Dynamically assigned role

            // Save the new user to the database
            newUser = userService.addUser(newUser);
            userWrapper.setUser(newUser);
            return ResponseEntity.ok(new ApiResponse(true, "User registered from Keycloak", userWrapper));
        }

        // 3️⃣ If user is not found in Keycloak or database
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "User not found in Keycloak or database", null));
    }
    @PreAuthorize("hasAnyAuthority('admin', 'user','chef_projet','ouvrier','architecte')")
    @GetMapping("/GetUserByEmail/{email}")
    public ResponseEntity<ApiResponse> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.GetUserByEmail(email);

        if (user.isPresent()) {
            UserWrapper userWrapper = new UserWrapper();
            userWrapper.setUser(user.get());
            return ResponseEntity.ok(new ApiResponse(true, "User found", userWrapper));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "User not found", null));
    }



    // tested on postman
    @PreAuthorize("hasAnyAuthority('admin')")
    @DeleteMapping("/DeleteUser/{username}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String username){
        Keycloak k = KeycloakConfig.getInstance();
        UserRepresentation userRep = new UserRepresentation();
        UserRepresentation userRepresentation = k.realm("constructionRealm").users().search(username).get(0);
        userRep.setId(userRepresentation.getId()); // setting the id of the user to be deleted
        try {
            k.realm("constructionRealm").users().get(userRep.getId()).remove();
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
        userService.DeleteUserByUserName(username);
        return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully in Keycloak and database ", null));

    }
    @GetMapping("/hello")
    public ResponseEntity<String> hello(@RequestHeader Map<String, String> headers) {
        headers.forEach((k, v) -> System.out.println(k + ": " + v));
        return ResponseEntity.ok("Hello from USER-SERVICE");
    }

    //tested and using it in Postman
    @GetMapping("/Mysession")
    public Authentication authentication(Authentication authentication) {
        log.info("Authentication: {}", authentication);
        return authentication;
    }
    //tested and using it in the front end
    @GetMapping("/GetAllUsers")
    @PreAuthorize("hasAnyAuthority('admin' , 'chef_projet')")
    public List<User> getAllUsers(){
        return userService.GetAllUsers();
    }



    @GetMapping("/GetUserLoginHistory/{username}")
    public ResponseEntity<List<Map<String, Object>>> getUserLoginHistory(@PathVariable String username) {
        String realm = "constructionRealm"; // Change this to match your Keycloak realm

        List<Map<String, Object>> loginHistory = KeycloakConfig.getUserLoginEvents(realm, username);

        return ResponseEntity.ok(loginHistory);
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @PreAuthorize("hasAnyAuthority('admin', 'user', 'chef_projet', 'architecte', 'ouvrier')")
    @PostMapping("/uploadProfilePictureAsBlobByEmail/{email}")
    public ResponseEntity<ApiResponse> uploadProfilePictureAsBlobByEmail(
            @PathVariable String email,
            @RequestParam("file") MultipartFile file) {

        try {
            Optional<User> optionalUser = userService.GetUserByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "User not found", null));
            }

            User user = optionalUser.get();
            user.setImage(file.getBytes());
            userService.UpdateUser(user);

            return ResponseEntity.ok(new ApiResponse(true, "Profile picture uploaded successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Upload failed: " + e.getMessage(), null));
        }
    }

    @GetMapping("/getProfilePictureBlobByEmail/{email}")
    public ResponseEntity<String> getProfilePictureAsBase64ByEmail(@PathVariable String email) {
        Optional<User> optionalUser = userService.GetUserByEmail(email);
        if (optionalUser.isEmpty() || optionalUser.get().getImage() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No profile picture set.");
        }

        byte[] imageData = optionalUser.get().getImage();
        String base64Image = Base64.getEncoder().encodeToString(imageData);
        return ResponseEntity.ok("data:image/png;base64," + base64Image);
    }


    @PostMapping("/CreateUsersFromExcel")
    public ResponseEntity<ApiResponse> addUsersFromExcel(@RequestParam("file") MultipartFile file) {
        try {
            Workbook workbook = new XSSFWorkbook(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            List<String> responses = new ArrayList<>();
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (currentRow.getRowNum() == 0) { // Skip header row
                    continue;
                }

                UserWrapper userWrapper = new UserWrapper();
                User user = new User();
                user.setLogin(currentRow.getCell(0).getStringCellValue());
                user.setEmail(currentRow.getCell(1).getStringCellValue());
                user.setFirstName(currentRow.getCell(3).getStringCellValue());
                user.setLastName(currentRow.getCell(4).getStringCellValue());
                user.setRole(String.valueOf(UserRole.user));
                UserRepresentation userRep = new UserRepresentation();
                userWrapper.setKeycloakUser(userRep);
                userWrapper.setUser(user);
                userWrapper.getKeycloakUser().setUsername(user.getLogin());
                userWrapper.getKeycloakUser().setEmail(user.getEmail());
                userWrapper.getKeycloakUser().setFirstName(user.getFirstName());
                userWrapper.getKeycloakUser().setLastName(user.getLastName());
                userWrapper.getKeycloakUser().setEmailVerified(true);
                userWrapper.getKeycloakUser().setEnabled(true);
                userWrapper.getKeycloakUser().setRealmRoles(List.of("etudiant"));
                CredentialRepresentation credRep = new CredentialRepresentation();
                credRep.setTemporary(true);
                credRep.setType("password");
                credRep.setValue("password");
                userWrapper.getKeycloakUser().setCredentials(List.of(credRep));

                ResponseEntity<ApiResponse> response = addUser(userWrapper);

                if (!response.getBody().isSuccess()) {
                    responses.add("Error occurred while creating user: " + user.getLogin() + " - " + "at line " + currentRow.getRowNum());
                }
            }

            workbook.close();
            if (responses.size() > 0) {

                return ResponseEntity.ok(new ApiResponse(false, responses.stream().reduce("", (a, b) -> a + "\n" + b), responses));
            }
            return ResponseEntity.ok(new ApiResponse(true, "Users created successfully from Excel file", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error occurred while processing Excel file: " + e.getMessage(), null));
        }
    }
    @PreAuthorize("hasAuthority('admin')")
    @GetMapping("/GetAllUsersFromKeycloak")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersFromKeycloak() {
        List<UserRepresentation> keycloakUsers = KeycloakConfig.getAllUsers();
        List<Map<String, Object>> usersList = new ArrayList<>();

        for (UserRepresentation user : keycloakUsers) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("enabled", user.isEnabled());
            userInfo.put("roles", user.getRealmRoles());

            usersList.add(userInfo);
        }

        return ResponseEntity.ok(usersList);
    }


}
