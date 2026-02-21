package art.example.server.service;

import art.example.server.model.Notification;
import art.example.server.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate  messagingTemplate;

    public Notification createNotification(String userId, String type, String title,
                                           String message, String relatedId){

        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setType(type);

        Notification savedNotification = notificationRepository.save(notification);

        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                savedNotification
        );

        return  savedNotification;
    }

    public List<Notification> getUserNotification(String userId){
        return  notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

    }
}
