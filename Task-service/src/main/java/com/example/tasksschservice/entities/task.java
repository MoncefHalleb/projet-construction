package com.example.tasksschservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne
    private Image image;

    /*
    @ElementCollection
    private List<Long> missionIds;*/

    private Long missionId; // 🧩 Liaison avec la mission
}
