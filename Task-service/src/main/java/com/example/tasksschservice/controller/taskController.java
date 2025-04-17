package com.example.tasksschservice.controller;

import com.example.tasksschservice.entities.Image;
import com.example.tasksschservice.entities.task;
import com.example.tasksschservice.model.mission;
import com.example.tasksschservice.repo.missionClient;
import com.example.tasksschservice.service.CloudinaryService;
import com.example.tasksschservice.service.ImageService;
import com.example.tasksschservice.service.taskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/tasks")
public class taskController {
    private final taskService taskservice;
    private final CloudinaryService cloudinaryService;
    private final ImageService imageService;
    private final missionClient missionclient;

    public taskController(taskService taskService,CloudinaryService cloudinaryService
            ,ImageService imageService,missionClient missionclient ) {
        this.taskservice = taskService;
        this.cloudinaryService=cloudinaryService;
        this.imageService=imageService;
        this.missionclient = missionclient;
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



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskservice.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
    /*
@PutMapping("/{id}")
    public ResponseEntity<task> updateTask(@PathVariable long id, @RequestBody task updatedTask) {
        try {
            task task = taskservice.updateTask(id, updatedTask);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }*/
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTask(
            @PathVariable Long id,
            @RequestParam(value = "photo", required = false) MultipartFile photo) throws IOException {
        // Récupérer la tâche existante
        Optional<task> optionalTask = taskservice.getTaskById(id);
        // Vérifier si la tâche existe
        if (optionalTask.isPresent()) {
            task existingTask = optionalTask.get();  // ✅ Déballer l'Optional
            // Si une nouvelle photo est fournie, upload sur Cloudinary
            if (photo != null && !photo.isEmpty()) {
                Map result = cloudinaryService.upload(photo);
                String photoUrl = (String) result.get("url");
                Image image = new Image();
                image.setName(photo.getOriginalFilename());
                image.setImageUrl(photoUrl);
                image.setImageId((String) result.get("public_id"));
                imageService.save(image);
                existingTask.setImage(image);  // ✅ Maintenant possible
            }
            // Sauvegarde de la tâche mise à jour
            taskservice.updateTask(id,existingTask);
            return new ResponseEntity<>("Tâche mise à jour avec succès !", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Tâche non trouvée.", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{taskId}/add-mission/{missionId}")
    public ResponseEntity<String> addMissionToTask(@PathVariable Long taskId, @PathVariable Long missionId) {
        Optional<task> optionalTask = taskservice.getTaskById(taskId);
        if (optionalTask.isPresent()) {
            mission mission = missionclient.findMissionById(missionId);
            if (mission == null) {
                return new ResponseEntity<>("Mission non trouvée.", HttpStatus.NOT_FOUND);
            }
            task existingTask = optionalTask.get();
            existingTask.setMissionId(missionId);
            taskservice.updateTask(taskId, existingTask);
            return new ResponseEntity<>("Mission ajoutée à la tâche avec succès.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Tâche non trouvée.", HttpStatus.NOT_FOUND);
        }
    }

}
