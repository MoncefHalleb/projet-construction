package tn.esprit.tpfoyer.services;

import com.google.api.client.auth.oauth2.Credential;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tn.esprit.tpfoyer.models.Project;
import tn.esprit.tpfoyer.repositories.ProjectRepository;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private GoogleCalendarService calendarService;

    @Autowired
    private HttpSession session; // Inject session to access stored credential

    private static final Logger LOGGER = Logger.getLogger(ProjectService.class.getName());

    public Project createProject(Project project) {
        Project savedProject = projectRepository.save(project);
        Credential credential = (Credential) session.getAttribute("googleCredential");
        if (credential != null) {
            try {
                calendarService.createEvent(
                        savedProject.getNomProjet(),
                        savedProject.getStartDate(),
                        savedProject.getEndDate(),
                        credential
                );
                LOGGER.info("Google Calendar event created for project: " + savedProject.getNomProjet());
            } catch (Exception e) {
                LOGGER.severe("Failed to create Google Calendar event: " + e.getMessage());
            }
        } else {
            LOGGER.warning("No Google credentials found in session");
        }
        return savedProject;
    }

    public Project updateProject(Long id, Project projectDetails) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setNomProjet(projectDetails.getNomProjet());
                    existingProject.setLocation(projectDetails.getLocation());
                    existingProject.setStatus(projectDetails.getStatus());
                    existingProject.setStartDate(projectDetails.getStartDate());
                    existingProject.setEndDate(projectDetails.getEndDate());
                    existingProject.setDescription(projectDetails.getDescription());

                    Credential credential = (Credential) session.getAttribute("googleCredential");
                    if (credential != null) {
                        try {
                            calendarService.createEvent(
                                    existingProject.getNomProjet(),
                                    existingProject.getStartDate(),
                                    existingProject.getEndDate(),
                                    credential
                            );
                            LOGGER.info("Google Calendar event updated for project: " + existingProject.getNomProjet());
                        } catch (Exception e) {
                            LOGGER.severe("Failed to update Google Calendar event: " + e.getMessage());
                        }
                    } else {
                        LOGGER.warning("No Google credentials found in session");
                    }

                    LOGGER.info("Updating project with ID: " + id);
                    return projectRepository.save(existingProject);
                }).orElseThrow(() -> new RuntimeException("Project not found with id " + id));
    }

    // Other methods remain unchanged
    public Page<Project> searchAndSortProjects(String search, Pageable pageable) {
        return projectRepository.findByNameContainingIgnoreCase(search, pageable);
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project saveProject(Project project) {
        LOGGER.info("Saving project: " + project.getNomProjet());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            LOGGER.info("Deleted project with ID: " + id);
        } else {
            throw new RuntimeException("Project not found with id " + id);
        }
    }
}