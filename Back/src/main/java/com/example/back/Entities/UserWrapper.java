package com.example.back.Entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.keycloak.representations.idm.UserRepresentation;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserWrapper {
    @Getter
    private UserRepresentation keycloakUser;
    private User user;
    private String imageUrl; // Add this field

    public void setKeycloakUser(UserRepresentation keycloakUser) {
        this.keycloakUser = keycloakUser;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
