package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Resource;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
