package art.example.server.service;

import art.example.server.dto.ChatMessageDTO;
import art.example.server.dto.ConversationDTO;
import art.example.server.model.ChatMessage;
import art.example.server.model.User;
import art.example.server.repository.ChatMessageRepository;
import art.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    public String  generateConversation(String userId1, String userId2){
        if(userId1.compareTo(userId2) < 0){
            return  userId1  + "_" + userId2;
        }else {
            return userId2 + "_" + userId1;
        }
    }

    public ChatMessageDTO sendMessage(String senderId, String  receiverId, String messageText){

        String conversationId = generateConversation(senderId, receiverId);

        ChatMessage message = new ChatMessage();
        message.setConversationId(conversationId);
        message.setSendId(senderId);
        message.setReceiverId(receiverId);
        message.setMessage(messageText);

        ChatMessage saveMessage  = chatMessageRepository.save(message);
        return mapToDTO(saveMessage);
    }

    public List<?> getConversationHistory(String userId1, String userId2){
        String  conversationId = generateConversation(userId1,userId2);
        List<ChatMessage> message = chatMessageRepository.findByConversationIdOrderByTimestampAsc(conversationId);

        return  message.stream()
                .map(this::mapToDTO)
                 .collect(Collectors.toList());
    }

    public List<?> getUserConversations(String userId){
        List<ChatMessage> allMessages = chatMessageRepository.findBySenderIdOrReceiverId(userId,userId);


        Map<String,List<ChatMessage>> conversationMap = allMessages.stream()
                .collect(Collectors.groupingBy(ChatMessage::getConversationId));

        List<ConversationDTO> conversations = new ArrayList<>();

        for(Map.Entry<String, List<ChatMessage>> entry : conversationMap.entrySet()){
String conversationId = entry.getKey();
List<ChatMessage> message = entry.getValue();

ChatMessage lastMessage = message.stream()
        .max(Comparator.comparing(ChatMessage::getTimeStamp))
        .orElse(null);

        if(lastMessage == null ) continue;

        String otherUserId = lastMessage.getSendId().equals(userId)
                ? lastMessage.getReceiverId()
                : lastMessage.getSendId();

        User otherUser = userRepository.findById(otherUserId).orElse(null);

        Long unreadCount = message.stream()
                .filter(m -> m.getReceiverId().equals(userId) && !m.getIsRead())
                .count();

            ConversationDTO convo= new ConversationDTO();
            convo.setConversationId(conversationId);
            convo.setLastMessage(lastMessage.getMessage());
            convo.setOtherUserId(otherUserId);
            convo.setOtherUserName(otherUser != null ? otherUser.getProfile().getName() :"Unknown" );
            convo.setLastMessageTime(lastMessage.getTimeStamp());
            convo.setUnreadCount(unreadCount);

            conversations.add(convo);
        }
            conversations.sort((a,b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()));
        return conversations;
    }

    public void markMessageAsRead(String converstationId,String userId){
List<ChatMessage> messages = chatMessageRepository.findByConversationIdOrderByTimestampAsc(converstationId);

messages.stream()
        .filter(m -> m.getIsRead().equals(userId) && !m.getIsRead())
        .forEach(m ->{
            m.setIsRead(true);
            chatMessageRepository.save(m);
        });
    }

    public Long getUnreadCount(String userId){
        return  chatMessageRepository.countByReceiverIdAndIsReadFalse(userId);
    }


    private ChatMessageDTO mapToDTO(ChatMessage message){
        User sender = userRepository.findById(message.getSendId()).orElse(null);
        User receiver = userRepository.findById(message.getReceiverId()).orElse(null);

        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setConnectionId(message.getConversationId());
        dto.setSenderId(message.getSendId());
        dto.setSenderName(sender != null ? sender.getProfile().getName() : "Unknown");
        dto.setReceiverId(message.getReceiverId());
        dto.setReceiverName(receiver !=  null  ?  receiver.getProfile().getName() :  "Unknown");
        dto.setMessage(message.getMessage());
        dto.setIsRead(message.getIsRead());
        dto.setTimeStamp(message.getTimeStamp());

        return dto;

    }
}
