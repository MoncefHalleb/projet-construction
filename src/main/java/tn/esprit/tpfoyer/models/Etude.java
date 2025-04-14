package tn.esprit.tpfoyer.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "etudes")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public class Etude {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate studyDate;

    @Lob
    private String documents;

    // ✅ Add missing fields
    private String typeEtude; // Instead of 'type_etude' (Java uses camelCase)
    private String topographie;
    private LocalDate dateDeRealisation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id") // Foreign key column
    private Project project;


}
