package com.example.Pidev.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.Pidev.models.Article;
import com.example.Pidev.models.Basket;
import com.example.Pidev.repositories.ArticleRepository;
import com.example.Pidev.repositories.BasketRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@Service
public class BasketService extends BaseService<Basket,Long> {
          private final BasketRepository basketRepository;
          private final ArticleRepository articleRepository;
    public Basket updateBasket(Long id, Basket updatedBasket) {
    Optional<Basket> existingBasketOptional = basketRepository.findById(id);

    if (existingBasketOptional.isPresent()) {
        Basket existingBasket = existingBasketOptional.get();
        existingBasket.setPrice(updatedBasket.getPrice());
        return basketRepository.save(existingBasket);
    } else {
        throw new EntityNotFoundException("Basket with ID " + id + " not found.");
    }
}

public Basket assignArticleToBasket(Long idArticle, Long idBasket){
        Article article = articleRepository.getReferenceById(idArticle);
        if (idBasket==null){
            Basket basket = new Basket();
            basket.setPrice(article.getPrice());
            List<Article> articles = new ArrayList<>();
            articles.add(article);
            basket.setArticles(articles);
            basketRepository.save(basket);
            return basket;
        }
        else{
            Basket basket=basketRepository.getReferenceById(idBasket);
            basket.setPrice(basket.getPrice()+article.getPrice());
            List<Article> articles = basket.getArticles();
            articles.add(article);
            basket.setArticles(articles);
            basketRepository.save(basket);
            return basket;
        }
}
}
