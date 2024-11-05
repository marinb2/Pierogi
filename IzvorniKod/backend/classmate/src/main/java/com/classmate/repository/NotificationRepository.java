package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
