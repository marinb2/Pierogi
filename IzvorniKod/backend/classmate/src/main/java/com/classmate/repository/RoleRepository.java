package com.classmate.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional <Role> findById(Long roleId);
}
