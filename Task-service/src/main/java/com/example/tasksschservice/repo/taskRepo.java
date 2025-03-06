package com.example.tasksschservice.repo;

import com.example.tasksschservice.entities.task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface taskRepo extends JpaRepository<task, Long> {
}
