package com.example.back.Services;

import com.example.back.Entities.Reponse;

import java.util.List;

public interface ReponseService {
    Reponse addReponse (Reponse reponse);
    Reponse updateReponse (long id_reponse, Reponse updatedReponse);
    List<Reponse> findAll();
    Reponse findById (long id_reponse);
    void delete (long id_reponse);
    Reponse addReponseAndAssignToReclamation (Reponse reponse, Long id_reclamation);
}

