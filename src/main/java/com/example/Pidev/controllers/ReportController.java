package com.example.Pidev.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pidev.services.ReportService;

@RestController
@RequestMapping("/reports")
public class ReportController {
    
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/stock")
    public ResponseEntity<Map<String, Object>> getStockReport() {
        return ResponseEntity.ok(reportService.generateStockReport());
    }
}
