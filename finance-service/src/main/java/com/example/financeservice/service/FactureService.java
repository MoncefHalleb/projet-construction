package com.example.financeservice.service;


import com.example.financeservice.entity.Facture;
import com.example.financeservice.repository.FactureRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FactureService {

    private final FactureRepository repository;

    public FactureService(FactureRepository repository) {
        this.repository = repository;
    }

    public List<Facture> getAll() {
        return repository.findAll();
    }

    public Facture getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Facture save(Facture facture) {
        return repository.save(facture);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

