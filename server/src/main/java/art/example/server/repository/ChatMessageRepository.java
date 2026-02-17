package art.example.server.repository;


import art.example.server.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage,String> {

    List<ChatMessage> findByConversationIdOrderByTimestampAsc(String conversationId);
    List<ChatMessage> findByReceiverIdAndIsReadFalse(String receiverId);
    Long countByReceiverIdAndIsReadFalse(String receiverId);
    List<ChatMessage> findBySenderIdOrReceiverId(String senderId, String receiverId);


}
