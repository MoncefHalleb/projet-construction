package com.example.financeservice.controller;



import com.example.financeservice.entity.Depense;
import com.example.financeservice.entity.Project;
import com.example.financeservice.service.DepenseService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/depenses")
@CrossOrigin("*")
public class DepenseController {

    private final DepenseService service;

    public DepenseController(DepenseService service) {
        this.service = service;
    }

    @GetMapping("findByProject/{projectId}")
    public List<Depense> getAll(@PathVariable Long projectId) {
        return service.getAll(projectId);
    }

    @GetMapping("/{id}")
    public Depense getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping("/add")
    public Depense create(@RequestBody Depense depense) {
        System.out.println("Dépense reçue : " + depense);
        return service.save(depense);
    }

    @PutMapping("/update/{id}")
    public Depense update(@PathVariable Long id, @RequestBody Depense depense) {
        depense.setId(id);
        return service.edit(id,depense);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }


    @GetMapping("allProject")
    public List<Project> getAllProject() {
        return service.getAllProject();
    }

    @PostMapping("/upload/{id}")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @PathVariable Long id) {
        try {
            service.storeFile(file,id);
            return ResponseEntity.ok("fichier ajouter avec succéss");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors du téléchargement du fichier : " + e.getMessage());
        }
    }

    @GetMapping("/getfile/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable Long id) {
        Depense file = service.getById(id);


        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(file.getFileType()))
                .body(file.getFileData());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Depense>> getAllByParam(@RequestParam String param) {
        List<Depense> interviews = service.getAllSearch(param);
        return ResponseEntity.ok(interviews);
    }
}

