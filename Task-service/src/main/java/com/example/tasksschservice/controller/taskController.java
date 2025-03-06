package com.example.tasksschservice.controller;

import com.example.tasksschservice.entities.task;
import com.example.tasksschservice.service.taskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/tasks")
public class taskController {
    private final taskService taskservice;

    public taskController(taskService taskService) {
        this.taskservice = taskService;
    }

    @GetMapping
    public List<task> getAllTasks() {
        return taskservice.getAllTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<task> getTaskById(@PathVariable Long id) {
        Optional<task> task = taskservice.getTaskById(id);
        return task.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public task createTask(@RequestBody task task) {
        return taskservice.saveTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<task> updateTask(@PathVariable Long id, @RequestBody task updatedTask) {
        try {
            task task = taskservice.updateTask(id, updatedTask);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskservice.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
