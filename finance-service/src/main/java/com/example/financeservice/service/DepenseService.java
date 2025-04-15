package com.example.financeservice.service;



import com.example.financeservice.entity.Depense;
import com.example.financeservice.entity.Project;
import com.example.financeservice.repository.DepenseRepository;
import com.example.financeservice.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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


    public Depense edit(Long id,Depense depense) {
        Depense oldDepense = getById(id);

        depense.setIdProjet(oldDepense.idProjet);
        depense.setFileData(oldDepense.getFileData());
        depense.setFileName(oldDepense.getFileName());
        depense.setFileType(oldDepense.getFileType());
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
}
