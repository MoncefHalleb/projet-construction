package com.example.back.ServiceImp;

import com.example.back.Entities.User;
import com.example.back.Repositories.UserRepository;
import com.example.back.SecurityConfig.KeycloakConfig;
import com.example.back.Services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.keycloak.representations.idm.UserRepresentation;
import com.example.back.Entities.Enums.UserRole;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    public User UpdateUser(User u) {
        return userRepository.save(u);
    }

    @Override
    public void DeleteUserByUserName(String username) {
        Long id = userRepository.findByLogin(username).getId_User();
        userRepository.deleteById(id);
    }


    @Override
    public List<User> GetAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User GetUserByEmail(String email) {
        return userRepository.findByEmail(email);
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
            // Get all users from Keycloak
            List<UserRepresentation> keycloakUsers = k.realm("constructionRealm").users().list();

            for (UserRepresentation keycloakUser : keycloakUsers) {
                // Check if user exists in DB
                if (userRepository.findByEmail(keycloakUser.getEmail()) == null) {
                    log.info("Adding user from Keycloak to database: {}", keycloakUser.getEmail());

                    // Create and save new user in database
                    User newUser = new User();
                    newUser.setEmail(keycloakUser.getEmail());
                    newUser.setLogin(keycloakUser.getUsername());
                    newUser.setFirstName(keycloakUser.getFirstName());
                    newUser.setLastName(keycloakUser.getLastName());
                    newUser.setKeycloakId(keycloakUser.getId());
                    newUser.setRole(UserRole.etudiant); // Default role

                    userRepository.save(newUser);
                }
            }
            log.info("Keycloak users successfully synchronized to the database.");
        } catch (Exception e) {
            log.error("Error synchronizing Keycloak users: {}", e.getMessage());
        }
    }



    // Schedule this method to run every hour

    @Override
    public User findById(Long idadmin) {
        return userRepository.findById(idadmin).orElse(null);
    }
}
