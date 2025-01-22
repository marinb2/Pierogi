package com.classmate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Dohvat rasporeda za određeni razred (npr. 1A)
    List<Schedule> findByGradeNumberAndGradeLetter(Integer gradeNumber, Character gradeLetter);

}
