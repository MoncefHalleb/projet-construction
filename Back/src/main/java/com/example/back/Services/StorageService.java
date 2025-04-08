package com.example.back.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class StorageService {

    private final String UPLOAD_DIR = "C:/Users/MSI/Downloads"; // Change this to your storage location

    public String uploadFile(MultipartFile file) throws IOException {
        // Generate unique file name
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);

        // Save file locally
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        // Return file URL (This should ideally be a publicly accessible URL)
        return "http://localhost:8080/uploads/" + fileName;
    }
}
