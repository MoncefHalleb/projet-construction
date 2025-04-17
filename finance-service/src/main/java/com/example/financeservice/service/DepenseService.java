package com.example.financeservice.service;



import com.example.financeservice.entity.Depense;
import com.example.financeservice.entity.Project;
import com.example.financeservice.repository.DepenseRepository;
import com.example.financeservice.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class DepenseService {

    private final DepenseRepository repository;
    private final ProjectRepository projectRepository;


    public DepenseService(DepenseRepository repository,ProjectRepository projectRepository) {
        this.repository = repository;
        this.projectRepository = projectRepository;
    }

    public List<Depense> getAll(Long idPorject) {
        return repository.findByIdProjet(idPorject);
    }

    public Depense getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Depense save(Depense depense) {
        depense.setDate(new Date());
        depense.setStatut(Depense.StatutDepense.EN_ATTENTE);
        return repository.save(depense);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
    public List<Project> getAllProject() {
        return projectRepository.findAll();
    }


    public void storeFile(MultipartFile file, Long idd) throws IOException {
        byte[] fileData = file.getBytes();
        Depense depense = repository.findById(idd).orElse(null);
        depense.setFileData(fileData);
        depense.setFileType(file.getContentType());
        depense.setFileName(file.getOriginalFilename());
        repository.save(depense);
    }

    public List<Depense> getAllSearch(String param) {
        return repository.search(param);
    }



    @Transactional
    public void processDepenseExcelFile(MultipartFile file, Long idProjet) {
        try (InputStream is = file.getInputStream();
             XSSFWorkbook workbook = new XSSFWorkbook(is)) {

            XSSFSheet sheet = workbook.getSheetAt(0); // Lire la première feuille

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Commence à 1 pour ignorer l'en-tête
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    Depense depense = new Depense();

                    depense.setMontant(row.getCell(0).getNumericCellValue());
                    depense.setType(Depense.TypeDepense.valueOf(row.getCell(1).getStringCellValue().trim()));
                    depense.setDate(row.getCell(2).getDateCellValue());
                    depense.setDescription(row.getCell(3).getStringCellValue().trim());
                    depense.setStatut(Depense.StatutDepense.EN_ATTENTE);
                    depense.setIdProjet(idProjet);

                    Depense d = repository.save(depense);
                    storeFile(file, d.getId());

                } catch (Exception ex) {
                    System.err.println("Erreur à la ligne " + (i + 1) + ": " + ex.getMessage());
                }
            }

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la lecture du fichier Excel", e);
        }
    }

}
