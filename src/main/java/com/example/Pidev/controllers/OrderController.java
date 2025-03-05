package com.example.Pidev.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pidev.models.Order;
import com.example.Pidev.services.OrderService;
@RestController
@RequestMapping("/orders")
public class OrderController extends BaseController<Order,Long>{

    public OrderController(OrderService orderService) {
        super(orderService);
    }
    
}
