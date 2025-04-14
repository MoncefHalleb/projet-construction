package tn.esprit.tpfoyer.services;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.logging.Logger;

@Service
public class GoogleCalendarService {
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "ConstructionSiteApp";
    private static final String CALENDAR_ID = "primary";
    private static final Logger LOGGER = Logger.getLogger(GoogleCalendarService.class.getName());
    private static final File DATA_STORE_DIR = new File("tokens");

    @Value("${google.credentials.file.path}")
    private String credentialsFilePath;

    private GoogleAuthorizationCodeFlow flow;

    // ✅ No constructor here

    @PostConstruct
    public void init() throws Exception {
        if (credentialsFilePath == null || credentialsFilePath.isBlank()) {
            throw new IllegalStateException("google.credentials.file.path is not set in application properties");
        }

        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        if (!credentialsFilePath.startsWith("/")) {
            credentialsFilePath = "/" + credentialsFilePath;
        }

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY,
                new InputStreamReader(getClass().getResourceAsStream(credentialsFilePath)));

        flow = new GoogleAuthorizationCodeFlow.Builder(
                httpTransport, JSON_FACTORY, clientSecrets,
                Collections.singletonList("https://www.googleapis.com/auth/calendar"))
                .setDataStoreFactory(new FileDataStoreFactory(DATA_STORE_DIR))
                .setAccessType("offline")
                .build();
    }

    public String getAuthorizationUrl() {
        return flow.newAuthorizationUrl()
                .setRedirectUri("http://localhost:8080/api/auth/google/callback")
                .build();
    }

    public Credential getCredentialsFromCode(String code) throws Exception {
        GoogleTokenResponse tokenResponse = flow.newTokenRequest(code)
                .setRedirectUri("http://localhost:8080/api/auth/google/callback")
                .execute();
        return flow.createAndStoreCredential(tokenResponse, "user");
    }

    public void createEvent(String projectName, LocalDate startDate, LocalDate endDate, Credential credential) throws Exception {
        if (credential == null) {
            throw new IllegalStateException("User not authenticated");
        }

        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();

        Event event = new Event()
                .setSummary("Project: " + projectName)
                .setStart(new EventDateTime().setDateTime(new DateTime(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli())))
                .setEnd(new EventDateTime().setDateTime(new DateTime(endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli())));

        service.events().insert(CALENDAR_ID, event).execute();
        LOGGER.info("Event created for project: " + projectName);
    }
}
