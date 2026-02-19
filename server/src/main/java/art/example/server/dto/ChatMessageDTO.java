package art.example.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {

    private  String id ;
    private  String connectionId;
    private String senderId;
    private  String senderName;
    private String receiverId;
    private String receiverName;
    private String message;
    private Boolean isRead;
    private LocalDateTime timeStamp;
}
