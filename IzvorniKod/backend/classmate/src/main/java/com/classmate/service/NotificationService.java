package com.classmate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.classmate.model.Notification;
import com.classmate.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        return notification.orElse(null);
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }


}
