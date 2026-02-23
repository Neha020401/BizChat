package art.example.server.controller;

import art.example.server.dto.ChatMessageDTO;
import art.example.server.service.ChatService;
import art.example.server.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/BizChat/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public  void sendMessage(@Payload Map<String, String> payload){
        String senderId = payload.get("senderId");
        String receiverId = payload.get("receiverId");
        String message = payload.get("message");

        ChatMessageDTO  chatMessage  = chatService.sendMessage(senderId,receiverId,message);

        messagingTemplate.convertAndSendToUser(
                receiverId,
                "/queue/messages",
                chatMessage
        );

        messagingTemplate.convertAndSendToUser(
                senderId,
                "/queue/messages",
                chatMessage
        );

        notificationService.createNotification(
                receiverId,
                "MESSAGE",
                "New Message",
                "You have a new message ",
                chatMessage.getId()
        );

    }

    @GetMapping("/conversation")
    public ResponseEntity<List> getConversation(
            @RequestParam String otherUserId,
            Authentication authentication
    ){
        String userId = (String) authentication.getPrincipal();
        List message = chatService.getConversationHistory(userId,otherUserId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List> getConversations(Authentication authentication){
        String userId = (String) authentication.getPrincipal();
        List conversations = chatService.getUserConversations(userId);
        return  ResponseEntity.ok(conversations);
    }

    @PutMapping("/read")
    public  ResponseEntity markAsRead(
            @RequestParam String otherUserId,
            Authentication authentication){

        String userId = (String) authentication.getPrincipal();
        String conversationsId = chatService.generateConversationId(userId,otherUserId);
        chatService.markMessageAsRead(conversationsId, userId);
        return  ResponseEntity.ok("Messages  marked  as read");
    }

    @GetMapping("/unread-count")
    public  ResponseEntity getUnreadCount(Authentication authentication){
        String userId = (String) authentication.getPrincipal();
        Long  count =  chatService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }


}
