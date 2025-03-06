package com.example.tasksschservice.service;

import com.example.tasksschservice.entities.task;
import com.example.tasksschservice.repo.taskRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class taskService {
    private final taskRepo taskRepository;

    public taskService(taskRepo taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public task saveTask(task task) {
        return taskRepository.save(task);
    }

    public task updateTask(Long id, task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setPriority(updatedTask.getPriority());
            task.setDueDate(updatedTask.getDueDate());
            task.setStatus(updatedTask.getStatus());
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
