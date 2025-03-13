package com.example.financeservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter@Setter
@NoArgsConstructor @AllArgsConstructor
public class Depense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;


    public Long idProjet;
    public Double montant;

    @Enumerated(EnumType.STRING)
    public TypeDepense type;

    @Temporal(TemporalType.DATE)
    public Date date;

    public String description;

    @Enumerated(EnumType.STRING)
    public StatutDepense statut;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdProjet() {
        return idProjet;
    }

    public void setIdProjet(Long idProjet) {
        this.idProjet = idProjet;
    }

    public Double getMontant() {
        return montant;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public TypeDepense getType() {
        return type;
    }

    public void setType(TypeDepense type) {
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public StatutDepense getStatut() {
        return statut;
    }

    public void setStatut(StatutDepense statut) {
        this.statut = statut;
    }


    enum TypeDepense {
        ACHAT_MATERIAUX,          // Achat de matériaux (béton, acier, bois...)
        MAIN_D_OEUVRE,            // Salaires des ouvriers et ingénieurs
        TRANSPORT_LOGISTIQUE,     // Transport des matériaux et des ouvriers
        LOCATION_EQUIPMENTS,      // Location de grues, échafaudages, machines
        PERMIS_REGLEMENTATIONS,   // Frais administratifs et permis
        ASSURANCE_SECURITE,       // Assurance du projet et équipements de sécurité
        SOUS_TRAITANCE,            // Sociétés de plomberie, électricité,Consultants et experts techniques,Entreprises de nettoyage après chantier
        Divers
        }

    enum StatutDepense {
        PAYE, EN_ATTENTE
    }
}