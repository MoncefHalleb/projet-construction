package com.example.back.SecurityConfig;


import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;


@Slf4j
public class KeycloakConfig {

    static Keycloak keycloak = null;

    public KeycloakConfig() {
    }

    public static Keycloak getInstance(){
        if(keycloak == null){

            keycloak = KeycloakBuilder.builder()
                    .serverUrl("http://localhost:8080/")
                    .realm("constructionRealm")
                    .grantType(OAuth2Constants.PASSWORD)
                    .username("user")
                    .password("user")
                    .clientId("backapp")
                    .clientSecret("ogiZOIVmFkm4P2ZMWBcXbsjPbTNng0J9")
                    .build();
        }
        return keycloak;
    }

}
