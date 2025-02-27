package tn.esprit.tpfoyer.repositories;

import tn.esprit.tpfoyer.models.Etude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.tpfoyer.models.Project;

import java.util.List;

@Repository
public interface EtudeRepository extends JpaRepository<Etude, Long> {


}
