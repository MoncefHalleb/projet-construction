package com.example.Pidev.services;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pidev.models.Article;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelService {

    public ByteArrayInputStream exportArticlesToExcel(List<Article> articles) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Articles");
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Name", "Description", "Price", "Stock", "Type"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (Article article : articles) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(article.getArticleId());
                row.createCell(1).setCellValue(article.getName());
                row.createCell(2).setCellValue(article.getDescription());
                row.createCell(3).setCellValue(article.getPrice());
                row.createCell(4).setCellValue(article.getStock());
                row.createCell(5).setCellValue(article.getType());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Error while exporting data to Excel", e);
        }
    }

    public List<Article> importArticlesFromExcel(MultipartFile file) {
        List<Article> articles = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                Article article = new Article();
                article.setName(row.getCell(1).getStringCellValue());
                article.setDescription(row.getCell(2).getStringCellValue());
                article.setPrice((float) row.getCell(3).getNumericCellValue());
                article.setStock((int) row.getCell(4).getNumericCellValue());
                article.setType(row.getCell(5).getStringCellValue());
                articles.add(article);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error while importing data from Excel", e);
        }
        return articles;
    }
}
