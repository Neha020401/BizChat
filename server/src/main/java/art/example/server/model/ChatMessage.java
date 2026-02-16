package art.example.server.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    @Indexed
    private String conversationId;

    @Indexed
    private  String sendId;

    @Indexed
    private  String receiverId;

    private  String message;

    private  Boolean isRead;

    private LocalDateTime timeStamp;

    public  ChatMessage(){
        this.timeStamp = LocalDateTime.now();
        this.isRead = false;
    }
}
