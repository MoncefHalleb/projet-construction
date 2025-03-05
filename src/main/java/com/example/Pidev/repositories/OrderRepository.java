package com.example.Pidev.repositories;

import org.springframework.stereotype.Repository;

import com.example.Pidev.models.Order;
@Repository
public interface OrderRepository extends BaseRepository<Order,Long>{
    
}
