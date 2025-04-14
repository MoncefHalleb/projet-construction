package tn.esprit.tpfoyer.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.tpfoyer.models.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
