package tn.esprit.tpfoyer.services;

import tn.esprit.tpfoyer.models.Etude;
import tn.esprit.tpfoyer.repositories.EtudeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EtudeService {

    @Autowired
    private EtudeRepository etudeRepository;

    public Etude createEtude(Etude etude) {
        return etudeRepository.save(etude);
    }

    public List<Etude> getAllEtudes() {
        return etudeRepository.findAll();
    }

    public Optional<Etude> getEtudeById(Long id) {
        return etudeRepository.findById(id);
    }

    public void deleteEtude(Long id) {
        etudeRepository.deleteById(id);
    }
}
