package com.example.back.Controllers;

import com.example.back.Entities.Reponse;
import com.example.back.ServiceImp.ReponseServiceImp;
import com.example.back.Services.ReponseService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/services/reponse")

public class ReponseController {
    private final ReponseService reponseService;

    @PostMapping
    public Reponse addReponse(@RequestBody Reponse reponse, @RequestParam("idReclamation") Long idReclamation) {
        return reponseService.addReponseAndAssignToReclamation(reponse, idReclamation);
    }
    @PutMapping("/{id_Reponse}")
    public ResponseEntity<Reponse> updateReponse(@PathVariable long id_Reponse, @RequestBody Reponse updatedReponse) {
        try {
            Reponse updated = reponseService.updateReponse(id_Reponse, updatedReponse);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/findAll")
    public List<Reponse> findAll() {
        return reponseService.findAll();
    }
    @GetMapping("/{id_Reponse}")
    public Reponse findById(@PathVariable long id_Reponse) {
        Reponse reponse = reponseService.findById(id_Reponse);
        return reponse;
    }
    @DeleteMapping("/{id_Reponse}")
    public void deleteReponse(@PathVariable long id_Reponse) {
        reponseService.delete(id_Reponse);
    }
}
