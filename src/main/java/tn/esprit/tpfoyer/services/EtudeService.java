package tn.esprit.tpfoyer.services;

import tn.esprit.tpfoyer.models.Etude;
import tn.esprit.tpfoyer.models.Project;
import tn.esprit.tpfoyer.repositories.EtudeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import tn.esprit.tpfoyer.repositories.ProjectRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class EtudeService {

    @Autowired
    private EtudeRepository etudeRepository;

    @Autowired
    private ProjectRepository projectRepository;


    @Value("${upload.path}") // Define the upload directory in application.properties
    private String uploadDir;

    private static final Logger LOGGER = Logger.getLogger(EtudeService.class.getName());

    // Get all   with sorting
    public List<Etude> getAllEtudes(String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        return etudeRepository.findAll(sort);
    }

    // Search etudes with pagination
    public Page<Etude> searchEtudes(String query, Pageable pageable) {
        return etudeRepository.findByTitleContainingIgnoreCaseOrTypeEtudeContainingIgnoreCase(query, query, pageable);
    }

    // ✅ CREATE an etude (with file upload)
    public Etude createEtude(String title, String description, String studyDate, String typeEtude,
                             String topographie, String dateDeRealisation, MultipartFile document) throws IOException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Etude etude = new Etude();
        etude.setTitle(title);
        etude.setDescription(description);
        etude.setStudyDate(parseDate(studyDate, formatter));
        etude.setTypeEtude(typeEtude);
        etude.setTopographie(topographie);
        etude.setDateDeRealisation(parseDate(dateDeRealisation, formatter));

        // ✅ Ensure upload directory exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new IOException("Could not create upload directory: " + uploadDir);
            }
        }

        // ✅ Save file and store only the file name
        if (document != null && !document.isEmpty()) {
            String fileName = saveFile(document);
            etude.setDocuments(fileName);
            LOGGER.info("File saved: " + fileName);
        } else {
            etude.setDocuments(null); // Ensure the field is not empty if no file is uploaded
        }

        return etudeRepository.save(etude);
    }

    // ✅ GET all etudes
    public List<Etude> getAllEtudes() {
        return etudeRepository.findAll();
    }

    // ✅ GET an etude by ID
    public Optional<Etude> getEtudeById(Long id) {
        return etudeRepository.findById(id);
    }
    // ✅ UPDATE an etude (with optional file update)
    public Etude updateEtude(Long id, String title, String description, String studyDate,
                             String typeEtude, String topographie, String dateDeRealisation,
                             MultipartFile document, Long projectId) throws IOException {

        // Fetch the Etude from the database
        Etude etude = etudeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etude not found with id: " + id));

        // Date format for parsing dates
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Update fields in Etude object
        etude.setTitle(title);
        etude.setDescription(description);
        etude.setStudyDate(parseDate(studyDate, formatter));
        etude.setTypeEtude(typeEtude);
        etude.setTopographie(topographie);
        etude.setDateDeRealisation(parseDate(dateDeRealisation, formatter));

        // ✅ Save new file if provided, and delete old file
        if (document != null && !document.isEmpty()) {
            // Remove old file before saving new one
            if (etude.getDocuments() != null) {
                deleteFile(etude.getDocuments()); // Delete the previous document
            }

            // Save new file and set the file name in Etude
            String fileName = saveFile(document);
            etude.setDocuments(fileName);
            LOGGER.info("Updated file saved: " + fileName);
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));
        etude.setProject(project);

        // Save and return the updated Etude
        return etudeRepository.save(etude);
    }

    // ✅ DELETE an etude (with file deletion)
    public void deleteEtude(Long id) {
        Etude etude = etudeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etude not found with id: " + id));

        if (etude.getDocuments() != null) {
            deleteFile(etude.getDocuments()); // Delete associated file
        }

        etudeRepository.deleteById(id);
    }

    // ✅ DOWNLOAD document by file name
    public byte[] getDocument(String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        return Files.readAllBytes(filePath);
    }
    public Optional<Project> getProjectById(Long projectId) {
        return projectRepository.findById(projectId);
    }

    // ✅ Save a file and return the stored file name
    private String saveFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        Files.write(filePath, file.getBytes());
        return fileName;
    }

    // ✅ Delete a file by name
    private void deleteFile(String fileName) {
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        try {
            Files.deleteIfExists(filePath);
            LOGGER.info("Deleted file: " + fileName);
        } catch (IOException e) {
            LOGGER.warning("Failed to delete file: " + fileName);
        }
    }

    // ✅ Helper method for date parsing
    private LocalDate parseDate(String date, DateTimeFormatter formatter) {
        return (date != null && !date.isEmpty()) ? LocalDate.parse(date, formatter) : null;
    }
}
