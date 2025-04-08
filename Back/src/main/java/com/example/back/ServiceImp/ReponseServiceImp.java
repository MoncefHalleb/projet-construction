package com.example.back.ServiceImp;

import com.example.back.Entities.Reclamation;
import com.example.back.Entities.Reponse;
import com.example.back.Repositories.ReclamationRepository;
import com.example.back.Repositories.ReponseRepository;
import com.example.back.Services.ReponseService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ReponseServiceImp implements ReponseService {
    private final ReponseRepository reponseRepository;
    private final ReclamationRepository reclamationRepository;

    @Override
    public Reponse addReponse(Reponse reponse) {

        return reponseRepository.save(reponse);
    }

    @Override
    public Reponse updateReponse(long id_reponse, Reponse updatedReponse) {
        Reponse existingReponse = reponseRepository.findById(id_reponse).orElseThrow(() -> new EntityNotFoundException("Réponse non trouvé avec l'id : "+ id_reponse));
        existingReponse.setMessage_reponse(updatedReponse.getMessage_reponse());
        existingReponse.setDate_Reponse(updatedReponse.getDate_Reponse());
        return reponseRepository.save(existingReponse);
    }

    @Override
    public List<Reponse> findAll() {
        return (List<Reponse>) reponseRepository.findAll();
    }

    @Override
    public Reponse findById(long id_reponse) {
        return reponseRepository.findById(id_reponse).orElse(null);
    }

    @Override
    public void delete(long id_reponse) {
        reponseRepository.deleteById(id_reponse);
    }

    @Override
    public Reponse addReponseAndAssignToReclamation(Reponse reponse, Long idReclamation) {
        Reclamation reclamation = reclamationRepository.findById(idReclamation).orElse(null);
        if (reclamation != null) {
            reponse.setReclamation(reclamation);
            return reponseRepository.save(reponse);
        } else {
            // Gérer le cas où la réclamation n'existe pas
            return null;
        }
    }
}
