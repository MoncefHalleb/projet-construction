package tn.esprit.tpfoyer.controllers;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import tn.esprit.tpfoyer.models.Etude;
import tn.esprit.tpfoyer.services.EmailSenderService;
import tn.esprit.tpfoyer.services.EtudeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/etudes")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class EtudeController {

    @Autowired
    private EtudeService etudeService;
    @Autowired
    private EmailSenderService emailSenderService;
    private static final Logger LOGGER = Logger.getLogger(EtudeController.class.getName());

    // ✅ Create an etude with file upload
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Etude> createEtude(
            @RequestParam("title") String title,  // Title from request
            @RequestParam("description") String description,  // Description from request
            @RequestParam("studyDate") String studyDate,  // Study date from request
            @RequestParam("typeEtude") String typeEtude,  // Type of Etude
            @RequestParam("topographie") String topographie,  // Topography
            @RequestParam("dateDeRealisation") String dateDeRealisation,  // Date of realization
            @RequestParam(value = "document", required = false) MultipartFile document ) {  // Project ID to link to the Etude



        try {
            Etude etude = etudeService.createEtude(title, description, studyDate, typeEtude, topographie, dateDeRealisation, document);
            String toEmail = "7libbon01@gmail.com"; // Change to actual recipient email
            String subject = "New Etude Created Successfully";
            String body = "<h2>Etude Successfully Created</h2>" +
                    "<table border='1' style='border-collapse: collapse; width: 100%;'>" +
                    "<tr><th style='padding: 8px; background-color: #f2f2f2;'>Field</th><th style='padding: 8px;'>Value</th></tr>" +
                    "<tr><td style='padding: 8px;'>Title</td><td style='padding: 8px;'>" + etude.getTitle() + "</td></tr>" +
                    "<tr><td style='padding: 8px;'>Description</td><td style='padding: 8px;'>" + etude.getDescription() + "</td></tr>" +
                    "<tr><td style='padding: 8px;'>Study Date</td><td style='padding: 8px;'>" + etude.getStudyDate() + "</td></tr>" +
                    "<tr><td style='padding: 8px;'>Type</td><td style='padding: 8px;'>" + etude.getTypeEtude() + "</td></tr>" +
                    "</table>";


            emailSenderService.sendemail(toEmail, subject, body);

            return ResponseEntity.ok(etude);

        } catch (Exception e) {
            LOGGER.severe("Error saving etude: " + e.getMessage());
            return null;
        }
    }

    // ✅ Get all etudes
    @GetMapping
    public ResponseEntity<List<Etude>> getAllEtudes() {
        List<Etude> etudes = etudeService.getAllEtudes();
        return ResponseEntity.ok(etudes);
    }

    // ✅ Get a single etude by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getEtudeById(@PathVariable Long id) {
        Optional<Etude> etude = etudeService.getEtudeById(id);
        if (etude.isPresent()) {
            return ResponseEntity.ok(etude.get());
        } else {
            LOGGER.warning("Etude not found with id: " + id);
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Update an etude with optional file update
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateEtude(@PathVariable Long id,
                                         @RequestParam("title") String title,
                                         @RequestParam("description") String description,
                                         @RequestParam("studyDate") String studyDate,
                                         @RequestParam("typeEtude") String typeEtude,
                                         @RequestParam("topographie") String topographie,
                                         @RequestParam("dateDeRealisation") String dateDeRealisation,
                                         @RequestParam(value = "document", required = false) MultipartFile document,
                                         @RequestParam("projectId") Long projectId) // ✅ added this
    {
        try {
            Etude updatedEtude = etudeService.updateEtude(id, title, description, studyDate, typeEtude, topographie, dateDeRealisation, document,projectId);
            return ResponseEntity.ok(updatedEtude);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating etude: " + e.getMessage());
        }
    }

    // ✅ Delete an etude by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEtude(@PathVariable Long id) {
        try {
            etudeService.deleteEtude(id);
            return ResponseEntity.ok("Etude deleted successfully");
        } catch (Exception e) {
            LOGGER.severe("Error deleting etude: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error deleting etude: " + e.getMessage());
        }
    }

    // ✅ Download a document by filename
    @GetMapping("/{fileName}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable String fileName) {
        try {
            byte[] document = etudeService.getDocument(fileName);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(document);
        } catch (IOException e) {
            LOGGER.severe("File not found: " + fileName);
            return ResponseEntity.notFound().build();
        }
    }

    // Get all etudes with sorting
    @GetMapping("/sorted")
    public List<Etude> getAllEtudes(
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        return etudeService.getAllEtudes(sortBy, sortDirection);
    }

    // Search etudes with pagination
    @GetMapping("/search")
    public Page<Etude> searchEtudes(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return etudeService.searchEtudes(query, PageRequest.of(page, size));
    }
}
