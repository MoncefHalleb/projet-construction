package com.example.back.Repositories;

import com.example.back.Entities.Enums.Statut_reclamation;
import com.example.back.Entities.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByStatutReclamation(Statut_reclamation statutReclamation);

}
