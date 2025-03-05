package com.example.Pidev.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.Pidev.repositories.BaseRepository;

import jakarta.transaction.Transactional;
@Transactional
public abstract class BaseService<T,ID> {
    @Autowired
    protected BaseRepository<T, ID> jpaRepo;

    public List<T> retrieveAll() {
        return jpaRepo.findAll();
    }

    public Optional<T> retrieveById(ID id) {
        return jpaRepo.findById(id);
    }

    public T add(T entity) {
        return jpaRepo.save(entity);
    }

    public T update(T entity) {
        return jpaRepo.save(entity);
    }

    public void delete(ID id) {
        jpaRepo.deleteById(id);
    }
}
