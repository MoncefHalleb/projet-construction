package tn.esprit.tpfoyer.controllers;

import tn.esprit.tpfoyer.models.Etude;
import tn.esprit.tpfoyer.services.EtudeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etudes")
public class EtudeController {

    @Autowired
    private EtudeService etudeService;

    // Create an étude
    @PostMapping
    public Etude createEtude(@RequestBody Etude etude) {
        return etudeService.createEtude(etude);
    }

    // Get all études
    @GetMapping
    public List<Etude> getAllEtudes() {
        return etudeService.getAllEtudes();
    }

    // Get an étude by ID
    @GetMapping("/{id}")
    public Optional<Etude> getEtudeById(@PathVariable Long id) {
        return etudeService.getEtudeById(id);
    }

    // Delete an étude by ID
    @DeleteMapping("/{id}")
    public void deleteEtude(@PathVariable Long id) {
        etudeService.deleteEtude(id);
    }
}
