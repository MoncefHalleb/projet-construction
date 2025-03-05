package com.example.Pidev.controllers;

import com.example.Pidev.models.Order;
import com.example.Pidev.services.OrderService;

public class OrderController extends BaseController<Order,Long>{

    public OrderController(OrderService orderService) {
        super(orderService);
    }
    
}
