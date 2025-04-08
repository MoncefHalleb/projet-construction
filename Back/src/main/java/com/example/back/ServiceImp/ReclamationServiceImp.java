package com.example.back.ServiceImp;

import com.example.back.Entities.Enums.Type_reclamation;
import com.example.back.Entities.Reclamation;
import com.example.back.Entities.Reponse;
import com.example.back.Repositories.ReclamationRepository;
import com.example.back.Services.GeminiService;
import com.example.back.Services.ReclamationService;
import com.example.back.Entities.Enums.Statut_reclamation;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReclamationServiceImp implements ReclamationService {
    private final ReclamationRepository reclamationRepository;

    @Autowired
    private GeminiService geminiService;

    @Override
    public Reclamation addReclamation(Reclamation reclamation) {
        reclamation.setDate_Reclamation(LocalDateTime.now());
        reclamation.setStatutReclamation(Statut_reclamation.PENDING_REVIEW);

        String prompt = "Réclamation du client : " + reclamation.getDescription_Reclamation();
        String reply = geminiService.generateAutoReply(prompt);

        reclamation.setAutoReply(reply);
        return reclamationRepository.save(reclamation);
    }

    @Override
    public void attachFile(Long reclamationId, byte[] fileContent, String fileName) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new EntityNotFoundException("Reclamation not found"));

        reclamation.setAttachment(fileContent);
        reclamation.setAttachmentName(fileName);

        reclamationRepository.save(reclamation);
    }
    @Scheduled(fixedRate = 3600000) // Every hour
    public void checkSlaViolations() {
        List<Reclamation> pendingReclamations = reclamationRepository.findByStatutReclamation(Statut_reclamation.EN_ATTENTE);
        LocalDateTime now = LocalDateTime.now();

        for (Reclamation reclamation : pendingReclamations) {
            if (Duration.between(reclamation.getDate_Reclamation(), now).toHours() >= 48) {
                reclamation.setStatutReclamation(Statut_reclamation.ESCALATED);
                reclamationRepository.save(reclamation);

                // Optional: Log or notify
                System.out.println("Reclamation #" + reclamation.getId_Reclamation() + " has been escalated.");
            }
        }
    }

    @Override
    public Reclamation updateReclamation(long id_Reclamation, Reclamation updatedReclamation) {
        // Recherche de la réclamation existante par son identifiant
        Reclamation existingReclamation = reclamationRepository.findById(id_Reclamation)
                .orElseThrow(() -> new EntityNotFoundException("Réclamation non trouvée avec l'ID : " + id_Reclamation));

        // Mettre à jour les champs de la réclamation existante avec les valeurs de la réclamation mise à jour
        existingReclamation.setTitle(updatedReclamation.getTitle());
        existingReclamation.setTypeReclamation(updatedReclamation.getTypeReclamation());
        existingReclamation.setDescription_Reclamation(updatedReclamation.getDescription_Reclamation());
        existingReclamation.setStatutReclamation(updatedReclamation.getStatutReclamation());
        existingReclamation.setReponse(updatedReclamation.getReponse());

        // Enregistrer la réclamation mise à jour dans la base de données
        return reclamationRepository.save(existingReclamation);
    }

    @Override
    public List<Reclamation> findAll() {
        return (List<Reclamation>) reclamationRepository.findAll();
    }

    @Override
    public Reclamation findById(long id_reclamation) {
        return reclamationRepository.findById(id_reclamation).orElse(null);
    }

    @Override
    public void delete(long id_reclamation) {
        reclamationRepository.deleteById(id_reclamation);
    }

    @Override
    public Map<Type_reclamation, Long> countByType() {
        List<Reclamation> reclamations = reclamationRepository.findAll();
        Map<Type_reclamation, Long> typeCounts = reclamations.stream()
                .filter(reclamation -> reclamation.getTypeReclamation() != null)
                .collect(Collectors.groupingBy(Reclamation::getTypeReclamation, Collectors.counting()));
        return typeCounts;
    }
}

