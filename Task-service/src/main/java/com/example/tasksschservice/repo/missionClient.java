package com.example.tasksschservice.repo;

import com.example.tasksschservice.model.mission;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "MISSION-SERVICE")
public interface missionClient {
/*
    @GetMapping("/missions/by-ids")
    List<mission> getMissionsByIds(@RequestParam List<Long> ids);

    @GetMapping("/missions/{id}")
    mission getMissionById(@PathVariable Long id);*/

    @GetMapping("/customers/{id}")
    mission findMissionById(@PathVariable Long id);

    @GetMapping("/customers")
    List<mission> allMissionss();
}
