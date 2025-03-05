package com.example.Pidev.services;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.Pidev.models.Article;
import com.example.Pidev.repositories.ArticleRepository;

import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@Service
public class ArticleService extends BaseService<Article,Long>{
      private final ArticleRepository articleRepository;
    public List<Article> searchArticles(String name, Float minPrice, Float maxPrice, String type) {
        return articleRepository.searchArticles(name, minPrice, maxPrice, type);
    }
    public List<Article> getBestSellingArticles(int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    return articleRepository.findBestSellingArticles(pageable);
}
public void addArticles (List<Article> articles){
    articleRepository.saveAll(articles);
}
}
