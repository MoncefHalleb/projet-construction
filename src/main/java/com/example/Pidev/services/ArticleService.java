package com.example.Pidev.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.Pidev.models.Article;
import com.example.Pidev.repositories.ArticleRepository;

import jakarta.persistence.EntityNotFoundException;
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

public Article updateArticle(Long id, Article updatedArticle) {
    Optional<Article> existingArticleOptional = articleRepository.findById(id);

    if (existingArticleOptional.isPresent()) {
        Article existingArticle = existingArticleOptional.get();
        existingArticle.setName(updatedArticle.getName());
        existingArticle.setDescription(updatedArticle.getDescription());
        existingArticle.setPrice(updatedArticle.getPrice());
        existingArticle.setStock(updatedArticle.getStock());
        existingArticle.setImage(updatedArticle.getImage());
        existingArticle.setType(updatedArticle.getType());
        return articleRepository.save(existingArticle);
    } else {
        throw new EntityNotFoundException("Article with ID " + id + " not found.");
    }
}

}
