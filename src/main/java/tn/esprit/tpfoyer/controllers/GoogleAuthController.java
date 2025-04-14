package tn.esprit.tpfoyer.controllers;

import com.google.api.client.auth.oauth2.Credential;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.tpfoyer.services.GoogleCalendarService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth/google")
public class GoogleAuthController {

    @Autowired
    private GoogleCalendarService calendarService;

    @GetMapping("/login")
    public ResponseEntity<String> getGoogleAuthUrl(HttpSession session) {
        String url = calendarService.getAuthorizationUrl();
        return ResponseEntity.ok(url);
    }

    @GetMapping("/callback")
    public ResponseEntity<String> googleCallback(@RequestParam("code") String code, HttpSession session) {
        try {
            Credential credential = calendarService.getCredentialsFromCode(code);
            session.setAttribute("googleCredential", credential); // Store credential in session
            return ResponseEntity.ok("Authentication successful! You can now create projects.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication failed: " + e.getMessage());
        }
    }
}