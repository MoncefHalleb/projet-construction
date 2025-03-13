package com.example.financeservice.repository;



import com.example.financeservice.entity.Depense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepenseRepository extends JpaRepository<Depense, Long> {
}
