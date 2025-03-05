package com.example.Pidev.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private Integer number;
    private float totalPrice;
    private String status;

    @OneToOne
    @JoinColumn(name = "basket_id")
    private Basket basket;
}