package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}
