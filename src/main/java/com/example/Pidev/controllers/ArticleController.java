package com.example.Pidev.controllers;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pidev.models.Article;
import com.example.Pidev.services.ArticleService;
import com.example.Pidev.services.ExcelService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/articles")
public class ArticleController extends BaseController<Article,Long>{
    private final ArticleService articleService;
    private final ExcelService excelService;
   public ArticleController(ArticleService articleService,ExcelService excelService) {
        super(articleService);
        this.articleService = articleService;
        this.excelService=excelService;
    }
    @PutMapping("/{id}")
    public Article update(@PathVariable Long id, @RequestBody Article article) {
        return  articleService.updateArticle(id,article);
        }
    @GetMapping("/search")
    public List<Article> searchArticles(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Float minPrice,
            @RequestParam(required = false) Float maxPrice,
            @RequestParam(required = false) String type) {
        return articleService.searchArticles(name, minPrice, maxPrice, type);
    }
    @GetMapping("/best-selling")
    public List<Article> getBestSellingArticles(@RequestParam(defaultValue = "3") int limit) {
        return articleService.getBestSellingArticles(limit);
    }
    @GetMapping("/export")
    public ResponseEntity<Resource> exportArticles() {
        ByteArrayInputStream in = excelService.exportArticlesToExcel(articleService.retrieveAll());
        InputStreamResource file = new InputStreamResource(in);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=articles.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

    @PostMapping("/import")
    public ResponseEntity<List<Article>> importArticles(@RequestParam("file") MultipartFile file) {
        List<Article> articles = excelService.importArticlesFromExcel(file);
        articleService.addArticles(articles);
        return ResponseEntity.ok(articles);
    }
}
