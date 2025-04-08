package com.example.back.Services;

import com.example.back.Entities.Enums.Type_reclamation;
import com.example.back.Entities.Reclamation;
import com.example.back.Entities.Reponse;

import java.util.List;
import java.util.Map;

public interface ReclamationService {
    Reclamation addReclamation(Reclamation reclamation);

    Reclamation updateReclamation(long id_Reclamation, Reclamation updatedReclamation);

    void attachFile(Long reclamationId, byte[] fileContent, String fileName);

    List<Reclamation> findAll();

    Reclamation findById(long id_reclamation);

    void delete(long id_reclamation);

    Map<Type_reclamation, Long> countByType();
}

