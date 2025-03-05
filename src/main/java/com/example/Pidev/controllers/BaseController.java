package com.example.Pidev.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.Pidev.services.BaseService;

public abstract class BaseController<T, ID> {

    protected final BaseService<T, ID> baseService;

    public BaseController(BaseService<T, ID> baseService) {
        this.baseService = baseService;
    }

    @GetMapping
    public List<T> getAll() {
        return baseService.retrieveAll();
    }

    @GetMapping("/{id}")
    public Optional<T> getById(@PathVariable ID id) {
        return baseService.retrieveById(id);
    }

    @PostMapping
    public T create(@RequestBody T entity) {
        return baseService.add(entity);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable ID id) {
        baseService.delete(id);
    }
}
