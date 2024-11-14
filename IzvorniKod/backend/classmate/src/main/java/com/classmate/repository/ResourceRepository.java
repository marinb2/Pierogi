package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Resource;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
}
