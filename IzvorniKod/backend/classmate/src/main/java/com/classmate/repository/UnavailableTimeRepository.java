package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.UnavailableTime;

public interface UnavailableTimeRepository extends JpaRepository<UnavailableTime, Long> {
}
