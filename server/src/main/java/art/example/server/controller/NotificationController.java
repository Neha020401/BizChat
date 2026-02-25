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

    @GetMapping("/read-all")
    public  ResponseEntity<?> markAllRead(Authentication authentication){
        String userId = (String)  authentication.getPrincipal();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notification  marked as read");
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnReadCount(Authentication authentication){
        String userId = (String) authentication.getPrincipal();
        Long count = notificationService.getUnReadCount(userId);
        return  ResponseEntity.ok(count);
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<?> deleteNotification(
            @PathVariable String id,
            Authentication authentication
    ){
        try{
        String  userId = (String) authentication.getPrincipal();
        notificationService.deleteNotification(id ,userId);
        return ResponseEntity.ok("Notification  deleted");
        }catch (RuntimeException e){
return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
