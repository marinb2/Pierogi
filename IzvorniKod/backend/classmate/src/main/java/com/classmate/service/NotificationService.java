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

    public Notification updateNotification(Long id, Notification updatedNotification) {
        Optional<Notification> existingNotificationOpt = notificationRepository.findById(id);
        if (existingNotificationOpt.isPresent()) {
            Notification existingNotification = existingNotificationOpt.get();
            existingNotification.setContent(updatedNotification.getContent());
            existingNotification.setSentAt(updatedNotification.getSentAt());
            existingNotification.setSender(updatedNotification.getSender());
            existingNotification.setRecipient(updatedNotification.getRecipient());
            return notificationRepository.save(existingNotification);
        }
        return null;
    }

    public boolean deleteNotification(Long id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }


}
