package com.example.financeservice.controller;

import com.example.financeservice.entity.Facture;
import com.example.financeservice.entity.Paiement;
import com.example.financeservice.service.PaiementService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin("*")
public class PaiementController {

    private final PaiementService service;

    public PaiementController(PaiementService service) {
        this.service = service;
    }

    @GetMapping
    public List<Paiement> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Paiement getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @PostMapping
    public Paiement create(@RequestBody Paiement paiement) {
        System.out.println("Facture reçue : " + paiement);
        return service.save(paiement);
    }


    @PutMapping("/{id}")
    public Paiement update(@PathVariable Long id, @RequestBody Paiement paiement) {
        paiement.setId(id);
        return service.save(paiement);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }




    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Facture facture) throws  StripeException {

        PaymentIntent intent = service.createPaymentIntent(facture);
        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", intent.getClientSecret());
        return ResponseEntity.ok(response);
    }
}

