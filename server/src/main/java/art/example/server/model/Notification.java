package art.example.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Indexed
    private String userId;

    private  String type ;

    private String title;

    private String message;

    private String relatedId;

    private Boolean isRead;

    private LocalDateTime createdAt;

    public Notification(){
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }
}
