package com.example.back.ServiceImp;

import com.example.back.Entities.User;
import com.example.back.Repositories.UserRepository;
import com.example.back.SecurityConfig.KeycloakConfig;
import com.example.back.Services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.stereotype.Service;
import org.keycloak.representations.idm.UserRepresentation;
import com.example.back.Entities.Enums.UserRole;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.back.Entities.Enums.UserRole.user;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    Keycloak keycloak = KeycloakConfig.getInstance();

    @Override
    public User addUser(User user) {
        log.info("Role being saved: {}", user.getRole());

        return userRepository.save(user);
    }

    @Override
    public List<User> AddUsers(List<User> users) {
        return userRepository.saveAll(users);
    }

    @Override
    public User UpdateUser(User updatedUser) {
        try {
            // ✅ Fetch the user from Keycloak using their username (login)
            List<UserRepresentation> keycloakUsers = keycloak.realm("constructionRealm")
                    .users()
                    .search(updatedUser.getLogin());

            if (keycloakUsers.isEmpty()) {
                log.error("❌ User not found in Keycloak: " + updatedUser.getLogin());
                throw new RuntimeException("User not found in Keycloak");
            }

            UserRepresentation keycloakUser = keycloakUsers.get(0);
            String keycloakUserId = keycloakUser.getId(); // Get Keycloak user ID

            // ✅ Update user fields in Keycloak
            keycloakUser.setFirstName(updatedUser.getFirstName());
            keycloakUser.setLastName(updatedUser.getLastName());
            keycloakUser.setEmail(updatedUser.getEmail());

            // ✅ Send the update request to Keycloak
            keycloak.realm("constructionRealm").users().get(keycloakUserId).update(keycloakUser);
            log.info("✅ User updated in Keycloak: " + updatedUser.getLogin());

            // ✅ After successful Keycloak update, update the database
            return userRepository.save(updatedUser);
        } catch (Exception e) {
            log.error("❌ Failed to update user in Keycloak: " + e.getMessage());
            throw new RuntimeException("Failed to update user in Keycloak");
        }
    }

    public void DeleteUserByUserName(String username) {
        Long id = userRepository.findByLogin(username).getId_User();
        userRepository.deleteById(id);
    }


    @Override
    public List<User> GetAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> GetUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    @Override
    public User GetUserByUserName(String username) {
        return userRepository.findByLogin(username);
    }


    public void assignRoles(String userId, List<String> roles) {
        List<RoleRepresentation> roleList = rolesToRealmRoleRepresentation(roles);
        keycloak.realm("constructionRealm")
                .users()
                .get(userId)
                .roles()
                .realmLevel()
                .add(roleList);
    }


    private List<RoleRepresentation> rolesToRealmRoleRepresentation(List<String> roles) {
        List<RoleRepresentation> existingRoles = keycloak.realm("constructionRealm")
                .roles()
                .list();

        List<String> serverRoles = existingRoles
                .stream()
                .map(RoleRepresentation::getName)
                .collect(Collectors.toList());
        List<RoleRepresentation> resultRoles = new ArrayList<>();

        for (String role : roles) {
            int index = serverRoles.indexOf(role);
            if (index != -1) {
                resultRoles.add(existingRoles.get(index));
            } else {
                log.info("Role doesn't exist");
            }
        }
        return resultRoles;
    }



    private final UserRepository userRepos;
    public void syncUsersFromKeycloak() {
        Keycloak k = KeycloakConfig.getInstance();
        log.info("Fetching users from Keycloak...");

        try {
            List<UserRepresentation> keycloakUsers = k.realm("constructionRealm").users().list();

            for (UserRepresentation keycloakUser : keycloakUsers) {
                if (userRepository.findByEmail(keycloakUser.getEmail()) == null) {
                    log.info("Adding user from Keycloak to database: {}", keycloakUser.getEmail());

                    User newUser = new User();
                    newUser.setEmail(keycloakUser.getEmail());
                    newUser.setLogin(keycloakUser.getUsername());
                    newUser.setFirstName(keycloakUser.getFirstName());
                    newUser.setLastName(keycloakUser.getLastName());
                    newUser.setKeycloakId(keycloakUser.getId());

                    // Extract only one role (either 'admin' or 'user')
                    List<String> roles = keycloak.realm("constructionRealm")
                            .users()
                            .get(keycloakUser.getId())
                            .roles()
                            .realmLevel()
                            .listAll()
                            .stream()
                            .map(RoleRepresentation::getName)
                            .collect(Collectors.toList());

                    // Assign the correct role
                    String assignedRole = roles.contains("admin") ? "admin" : "user";
                    newUser.setRole(String.valueOf(UserRole.valueOf(String.valueOf(user))));

                    userRepository.save(newUser);
                }
            }
            log.info("Keycloak users successfully synchronized to the database.");
        } catch (Exception e) {
            log.error("Error synchronizing Keycloak users: {}", e.getMessage());
        }
    }

    public boolean existsByLogin(String login) {
        return userRepository.findByLogin(login) != null;
    }

    // Schedule this method to run every hour

    @Override
    public User findById(Long idadmin) {
        return userRepository.findById(idadmin).orElse(null);
    }
}
