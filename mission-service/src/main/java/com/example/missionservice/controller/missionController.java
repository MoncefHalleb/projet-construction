package com.example.missionservice.controller;

import com.example.missionservice.entities.mission;
import com.example.missionservice.service.missionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

public class missionController {

    private final missionService missionservice;


    public missionController(missionService missionservice) {
        this.missionservice = missionservice;
    }

    @GetMapping
    public List<mission> getAllMissions() {
        return missionservice.getAllMissions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<mission> getMissionById(@PathVariable Long id) {
        Optional<mission> mission = missionservice.getMissionById(id);
        return mission.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public mission createMission(@RequestBody mission mission) {
        return missionservice.saveMission(mission);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMission(@PathVariable Long id) {
        missionservice.deleteMission(id);
        return ResponseEntity.noContent().build();
    }


}
