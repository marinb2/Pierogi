package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}
