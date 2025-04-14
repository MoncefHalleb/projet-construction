package tn.esprit.tpfoyer.repositories;

import tn.esprit.tpfoyer.models.Etude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.tpfoyer.models.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Repository
public interface EtudeRepository extends JpaRepository<Etude, Long> {
    // Search by title or typeEtude
    List<Etude> findByTitleContainingIgnoreCaseOrTypeEtudeContainingIgnoreCase(String title, String typeEtude);

    // Sort etudes dynamically
    List<Etude> findAll(Sort sort);

    // Paginated search
    Page<Etude> findByTitleContainingIgnoreCaseOrTypeEtudeContainingIgnoreCase(String title, String typeEtude, Pageable pageable);
}
