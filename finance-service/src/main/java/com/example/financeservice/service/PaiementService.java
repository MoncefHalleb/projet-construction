package com.example.financeservice.service;



import com.example.financeservice.entity.Facture;
import com.example.financeservice.entity.MethodePaiement;
import com.example.financeservice.entity.Paiement;
import com.example.financeservice.repository.PaiementRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaiementService {
    @Value("${stripe.secret.key}")
    private String secretKey;
    private final PaiementRepository repository;

    public PaiementService(PaiementRepository repository) {
        this.repository = repository;
    }

    public List<Paiement> getAll() {
        return repository.findAll();
    }

    public Paiement getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Paiement save(Paiement paiement) {
        return repository.save(paiement);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public PaymentIntent createPaymentIntent(Facture facture) throws StripeException {

        Paiement paiement = new Paiement();
        paiement.setDatePaiement(new Date());
        paiement.setFacture(facture);
        paiement.setMontantPaye(facture.getMontantTotal());
        paiement.setMethode(MethodePaiement.VIREMENT);
        repository.save(paiement);
        Map<String, Object> params = new HashMap<>();
        params.put("amount", Math.round(facture.getMontantTotal() * 100)); // en centimes
        params.put("currency", "EUR");
        return PaymentIntent.create(params);
    }
}

