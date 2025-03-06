package com.example.tasksschservice.service;

import com.example.tasksschservice.entities.Image;
import com.example.tasksschservice.entities.Status;
import com.example.tasksschservice.entities.task;
import com.example.tasksschservice.repo.taskRepo;
import org.springframework.scheduling.annotation.Scheduled;
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
        task.setImage(null);
        return taskRepository.save(task);
    }

    public task updateTaskImage(Long taskId, Image image) {
        return taskRepository.findById(taskId).map(task -> {
            task.setImage(image);
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public task updateTask(long id, task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setPriority(updatedTask.getPriority());
            task.setDueDate(updatedTask.getDueDate());
            task.setDueDate(updatedTask.getStartDate());
            task.setStatus(updatedTask.getStatus());
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }



    @Scheduled(cron = "* * * * * *")
    public void updateTaskStatus() {
        try {
            taskRepository.updateTaskToInProgress(Status.INPROGRESS);
            taskRepository.updateTaskToDone(Status.DONE);
        } catch (Exception e) {
            // Gestion d'erreur si une exception se produit pendant la mise à jour
            System.err.println("Erreur lors de la mise à jour des statuts des tâches : " + e.getMessage());
        }
    }

}
