package com.example.financeservice.controller;


import com.example.financeservice.entity.Facture;
import com.example.financeservice.service.FactureService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService service;

    public FactureController(FactureService service) {
        this.service = service;
    }

    @GetMapping
    public List<Facture> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Facture getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Facture create(@RequestBody Facture facture) {
        System.out.println("Facture reçue : " + facture);
        return service.save(facture);
    }

    @PutMapping("/{id}")
    public Facture update(@PathVariable Long id, @RequestBody Facture facture) {
        facture.setId(id);
        return service.save(facture);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
