package tn.esprit.tpfoyer.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.tpfoyer.models.Project;
import tn.esprit.tpfoyer.services.ProjectService;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    private static final Logger LOGGER = Logger.getLogger(ProjectController.class.getName());

    /**
     * ✅ Create a new project
     */
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project savedProject = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
    }


    /**
     * ✅ Get all projects (with optional pagination)
     */
    @GetMapping
    public ResponseEntity<Page<Project>> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Project> projects = projectService.searchAndSortProjects("", PageRequest.of(page, size));
        return ResponseEntity.ok(projects);
    }

    /**
     * ✅ Get project by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found"));
    }


    /**
     * ✅ Update an existing project
     */
    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project project) {
        try {
            Project updatedProject = projectService.updateProject(id, project);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * ✅ Delete a project by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok("Project deleted successfully");
        } catch (Exception e) {
            LOGGER.severe("Error deleting project: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error deleting project: " + e.getMessage());
        }
    }

    /**
     * ✅ Search and sort projects with pagination
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Project>> searchProjects(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Project> projects = projectService.searchAndSortProjects(query, PageRequest.of(page, size));
        return ResponseEntity.ok(projects);
    }


}
