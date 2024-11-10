package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
