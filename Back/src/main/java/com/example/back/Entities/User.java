package com.example.back.Entities;

import com.example.back.Entities.Enums.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    Long id_User;
    String login;
    String email;
    String firstName;
    String lastName;
    @Column(length = 255)
    String role;

    int num_tel;


        @Column(name = "keycloak_id", unique = true)
        private String keycloakId; // Store Keycloak ID

    @Lob // Store as BLOB
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;




}
