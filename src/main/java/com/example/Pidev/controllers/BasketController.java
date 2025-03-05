package com.example.Pidev.controllers;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pidev.models.Basket;
import com.example.Pidev.services.BasketService;
@RestController
@RequestMapping("/basket")
public class BasketController extends BaseController<Basket,Long> {
    private final BasketService basketService;
       public BasketController(BasketService basketService) {
        super(basketService);
        this.basketService=basketService;
    }
      @PutMapping("/{id}")
    public Basket update(@PathVariable Long id, @RequestBody Basket basket) {
        return  basketService.updateBasket(id,basket);
        }
      @PostMapping("/{idArticle}")
      public Basket assignArticletoBasket(@PathVariable Long idArticle,@RequestParam(value = "idB", required = false) Long idB){
        return basketService.assignArticleToBasket(idArticle, idB);
      }
}
