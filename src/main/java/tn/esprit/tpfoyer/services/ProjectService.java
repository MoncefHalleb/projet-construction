package tn.esprit.tpfoyer.services;

import tn.esprit.tpfoyer.models.Project;
import tn.esprit.tpfoyer.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    // Create a new project
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    // Get all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Get a project by ID
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    // Update a project
    public Project updateProject(Long id, Project projectDetails) {
        return projectRepository.findById(id).map(project -> {
            project.setName(projectDetails.getName());
            project.setLocation(projectDetails.getLocation());
            project.setStatus(projectDetails.getStatus());
            project.setStartDate(projectDetails.getStartDate());
            project.setEndDate(projectDetails.getEndDate());
            project.setImages(projectDetails.getImages());
            return projectRepository.save(project);
        }).orElseThrow(() -> new RuntimeException("Project not found with id " + id));
    }

    // Delete a project by ID
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    // Get projects by status (e.g., PLANIFIÉ, EN COURS, TERMINÉ)
    public List<Project> getProjectsByStatus(String status) {
        return projectRepository.findByStatus(status);
    }
}
