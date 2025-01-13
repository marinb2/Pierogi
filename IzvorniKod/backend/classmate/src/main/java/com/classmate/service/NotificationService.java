package com.classmate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public boolean deleteNotification(Long id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Notification> getNotificationsBySubjectId(Long id){
        List<Notification> all_notifs = notificationRepository.findAll();
        List<Notification> wanted_notifs = new ArrayList<Notification>();

        for (int i = 0; i < all_notifs.size(); i++) {
            if (all_notifs.get(i).getSubject().getSubjectId().equals(id)) {
                wanted_notifs.add(all_notifs.get(i));
            }
        }

        return wanted_notifs;
    }


}
