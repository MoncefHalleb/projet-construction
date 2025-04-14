package tn.esprit.tpfoyer.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name; // <== assure-toi que ce champ existe !

    @Column(name = "nom_projet") // Rename the column in DB
    private String nomProjet; // Change from 'name' to 'nomProjet'

    private String location;
    private String status; // PLANIFIÉ, EN COURS, TERMINÉ
    private LocalDate startDate;
    private LocalDate endDate;
    private Double latitude;
    private Double longitude;

    @Lob
    private String images;

    private String description;

    // Optional: remove the get/set for "description" since Lombok already handles it
}

