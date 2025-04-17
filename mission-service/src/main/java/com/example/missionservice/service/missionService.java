package com.example.missionservice.service;

import com.example.missionservice.entities.mission;
import com.example.missionservice.repo.missionRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class missionService {
    private final missionRepo missionrepo;

    public missionService(missionRepo missionrepo) {
        this.missionrepo = missionrepo;
    }


    public List<mission> getAllMissions() {
        return missionrepo.findAll();
    }

    public Optional<mission> getMissionById(Long id) {
        return missionrepo.findById(id);
    }

    public mission saveMission(mission mission) {
        return missionrepo.save(mission);
    }

    public void deleteMission(Long id) {
        missionrepo.deleteById(id);
    }
}
