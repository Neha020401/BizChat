package art.example.server.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDTO {

    private  String conversationId;
    private  String otherUserId;
    private String otherUserName;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Long unreadCount;

}
