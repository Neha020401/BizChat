package art.example.server.controller;


import art.example.server.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/BizChat/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List> getNotifications(Authentication authentication){
        String userId = (String) authentication.getPrincipal();
        List notifications = notificationService.getUserNotification(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public  ResponseEntity<List> getUnreadNotifications(Authentication authentication){
        String userId = (String) authentication.getPrincipal();
        List notifications = notificationService.getUserNotification(userId);
        return  ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity markAsRead(@PathVariable  String id){
        notificationService.markAsRead(id);
        return  ResponseEntity.ok("Notification marked as read");
    }
}
