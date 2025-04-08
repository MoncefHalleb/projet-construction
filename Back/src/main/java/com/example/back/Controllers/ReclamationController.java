package com.example.back.Controllers;

import com.example.back.Entities.Enums.Statut_reclamation;
import com.example.back.Entities.Enums.Type_reclamation;
import com.example.back.Entities.Reclamation;
import com.example.back.ServiceImp.ReclamationServiceImp;
import com.example.back.Services.ReclamationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/services/reclamation")

public class ReclamationController {
    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }

    @PostMapping
    public Reclamation addReclamation(@RequestBody Reclamation reclamation) {
        reclamation.setStatutReclamation(Statut_reclamation.PENDING_REVIEW);

        return reclamationService.addReclamation(reclamation);
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadReclamationFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("reclamationId") Long id) {
        try {
            byte[] fileContent = file.getBytes();
            reclamationService.attachFile(id, fileContent, file.getOriginalFilename());
            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }


    @PutMapping("/{id_Reclamation}")
    public ResponseEntity<Reclamation> updateReclamation(@PathVariable long id_Reclamation, @RequestBody Reclamation updatedReclamation) {

        try {
            Reclamation updated = reclamationService.updateReclamation(id_Reclamation, updatedReclamation);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/findAll")
    public List<Reclamation> findAll() {
        return reclamationService.findAll();
    }

    @GetMapping("/{id_Reclamation}")
    public Reclamation findById(@PathVariable long id_Reclamation) {
        Reclamation reclamation = reclamationService.findById(id_Reclamation);
        return reclamation;
    }

    @DeleteMapping("/{id_Reclamation}")
    public void deleteReclamation(@PathVariable long id_Reclamation) {
        reclamationService.delete(id_Reclamation);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<Type_reclamation, Long>> getReclamationStatistics() {
        Map<Type_reclamation, Long> statistics = reclamationService.countByType();
        return ResponseEntity.ok(statistics);
    }

}
