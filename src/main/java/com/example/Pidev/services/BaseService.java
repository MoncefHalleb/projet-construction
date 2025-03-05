package com.example.Pidev.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.Pidev.repositories.BaseRepository;

import jakarta.transaction.Transactional;
@Transactional
public abstract class BaseService<T,ID> {
    @Autowired
    BaseRepository<T, ID> jpaRepo;

    public List<T> retrieveAll() {
        return this.jpaRepo.findAll();
    }

    public Optional<T> retrieveById(ID id) {
        return this.jpaRepo.findById(id);
    }

    public T add(T entity) {
        return this.jpaRepo.save(entity);
    }

    public void delete(ID id) {
        this.jpaRepo.deleteById(id);
    }
}
