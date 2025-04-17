package com.example.tasksschservice.repo;

import com.example.tasksschservice.entities.Status;
import com.example.tasksschservice.entities.task;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface taskRepo extends JpaRepository<task, Long> {
//repo for updating status automatic
    @Transactional
    @Modifying
    @Query("UPDATE task s SET s.status = :statut WHERE s.startDate <= CURRENT_DATE AND s.dueDate > CURRENT_DATE AND s.status = 'UNREACHED' ")
    void updateTaskToInProgress(Status statut);

    @Transactional
    @Modifying
    @Query("UPDATE task s SET s.status = :statut WHERE s.dueDate <= CURRENT_DATE AND s.status = 'INPROGRESS'")
    void updateTaskToDone(Status statut);


}
