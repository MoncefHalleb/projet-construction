package com.example.financeservice.controller;



import com.example.financeservice.entity.Depense;
import com.example.financeservice.service.DepenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/depenses")
public class DepenseController {

    private final DepenseService service;

    public DepenseController(DepenseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Depense> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Depense getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Depense create(@RequestBody Depense depense) {
        System.out.println("Dépense reçue : " + depense);
        return service.save(depense);
    }

    @PutMapping("/{id}")
    public Depense update(@PathVariable Long id, @RequestBody Depense depense) {
        depense.setId(id);
        return service.save(depense);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

