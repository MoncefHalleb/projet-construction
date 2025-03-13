package com.example.financeservice.service;



import com.example.financeservice.entity.Depense;
import com.example.financeservice.repository.DepenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepenseService {

    private final DepenseRepository repository;

    public DepenseService(DepenseRepository repository) {
        this.repository = repository;
    }

    public List<Depense> getAll() {
        return repository.findAll();
    }

    public Depense getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Depense save(Depense depense) {
        return repository.save(depense);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
