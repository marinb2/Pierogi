package com.classmate.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional <User> findByUsername(String username);
}
