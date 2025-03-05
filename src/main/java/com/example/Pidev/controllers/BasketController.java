package com.example.Pidev.controllers;

import com.example.Pidev.models.Basket;
import com.example.Pidev.services.BasketService;

public class BasketController extends BaseController<Basket,Long> {
       public BasketController(BasketService basketService) {
        super(basketService);
    }
}
