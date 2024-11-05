package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Confirmation;

public interface ConfirmationRepository extends JpaRepository<Confirmation, Long> {
}
