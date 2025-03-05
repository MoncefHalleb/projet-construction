package com.example.Pidev.services;

import org.springframework.stereotype.Service;

import com.example.Pidev.repositories.ArticleRepository;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {
    
    private final ArticleRepository articleRepository;

    public ReportService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Map<String, Object> generateStockReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("Total Articles", articleRepository.count());
        report.put("Out of Stock", articleRepository.countByStock(0));
        return report;
    }
}
