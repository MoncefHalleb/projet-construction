package com.example.back.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Reponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    Long id_Reponse;

    String message_reponse;

    LocalDateTime date_Reponse;

    @PrePersist
    public void prePersist() {
        this.date_Reponse = LocalDateTime.now();
    }
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    Reclamation reclamation;

}
