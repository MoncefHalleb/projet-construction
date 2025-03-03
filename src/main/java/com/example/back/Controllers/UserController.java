package com.example.back.Controllers;

import com.example.back.Entities.Enums.UserRole;
import com.example.back.Entities.User;
import com.example.back.Entities.UserWrapper;
import com.example.back.ExceptionHandling.ApiResponse;
import com.example.back.Repositories.UserRepository;
import com.example.back.SecurityConfig.KeycloakConfig;
import com.example.back.Services.UserService;
import jakarta.ws.rs.core.Response;
import com.example.back.Services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/service/user")
@Slf4j
public class UserController {

    private final UserService userService ;


    //tested and using it in the front end
    @PreAuthorize("hasAnyAuthority('admin')")
    @PostMapping("/CreateUser")
    public ResponseEntity<ApiResponse> addUser(@RequestBody UserWrapper userWrapper ){
        Keycloak k = KeycloakConfig.getInstance();
        UserRepresentation userRep = userWrapper.getKeycloakUser();
        try (Response response = k.realm("constructionRealm").users().create(userRep)) {
            if (response.getStatus() != Response.Status.CREATED.getStatusCode()) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ApiResponse(false, response.readEntity(String.class), null));
            } else {
                UserRepresentation userRepresentation = k.realm("constructionRealm").users().search(userRep.getUsername()).get(0);
                userService.assignRoles(userRepresentation.getId(), userRep.getRealmRoles());
                try {
                    User u = userService.addUser(userWrapper.getUser());
                    return ResponseEntity.ok(new ApiResponse(true, "User created successfully in Keycloak and database ", u));
                }
                catch (Exception e){
                    return ResponseEntity.status(HttpStatus.OK)
                            .body(new ApiResponse(false, e.getMessage(), null));
                }
            }
        }
    }

    //tested and using it in the front end
    @PreAuthorize("hasAnyAuthority('admin', 'Agentesprit')")
    @PutMapping("/UpdateUser")
    public ResponseEntity<ApiResponse> updateUser(@RequestBody UserWrapper user){
        Keycloak k = KeycloakConfig.getInstance();
        UserRepresentation userRep = user.getKeycloakUser();
        User user1 = user.getUser();
        log.info("User id : {}", user1.getId_User());
        UserRepresentation userRepresentation = k.realm("constructionRealm").users().search(userRep.getUsername()).get(0);
        userRep.setId(userRepresentation.getId()); // setting the id of the user to be updated
        try {
            k.realm("constructionRealm").users().get(userRep.getId()).update(userRep);
        }
        catch (Exception e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ApiResponse(false, e.getMessage(), null));

        }
        user.setKeycloakUser(userRep);
        user1 = userService.UpdateUser(user1);
        user.setUser(user1);
        return ResponseEntity.ok(new ApiResponse(true, "User updated successfully in Keycloak and database ", user));
    }


    //tested and using it in the front end
    @GetMapping("/GetUserByEmail/{email}")
    public UserWrapper getUserByEmail(@PathVariable String email){
        Keycloak k = KeycloakConfig.getInstance();
        log.info("executing getUserByEmail");
        UserWrapper userWrapper = new UserWrapper();
        User u =userService.GetUserByEmail(email);
        userWrapper.setUser(u);
        log.info(u.getEmail() +"   "+ u.getId_User());

        try {
            k.realm("constructionRealm").users().searchByEmail(email,true).forEach(
                    user -> {
                        log.info("User: {}", user);
                        userWrapper.setKeycloakUser(user);
                    }
            );
        }
        catch (Exception e){
            log.error(e.getMessage());
        }
        return userWrapper;

    }


    @PreAuthorize("hasAnyAuthority('admin', 'Agentesprit')")
    @GetMapping("/GetUserByUserName/{username}")
    public User getUserByUserName(@PathVariable String username){
        return userService.GetUserByUserName(username);
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

    //tested and using it in Postman
    @GetMapping("/Mysession")
    @PreAuthorize("hasAnyAuthority('admin')")
    public Authentication authentication(Authentication authentication) {
        log.info("Authentication: {}", authentication);
        return authentication;
    }
    //tested and using it in the front end
    @GetMapping("/GetAllUsers")
    @PreAuthorize("hasAnyAuthority('admin')")
    public List<User> getAllUsers(){
        return userService.GetAllUsers();
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
                user.setRole(UserRole.user);
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

}
