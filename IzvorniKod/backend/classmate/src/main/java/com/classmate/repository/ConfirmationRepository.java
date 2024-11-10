package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Confirmation;

@Repository
public interface ConfirmationRepository extends JpaRepository<Confirmation, Long> {
}
