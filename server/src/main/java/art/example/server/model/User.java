package art.example.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {

    @Id
    private  String id;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String role; // Roles are Buyer(ArtLover), Seller(The Artist), and Both
    private Profile profile;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class Profile{
        private String name;
        private String avatar;
        private String bio;
        private String phone;
    }

    public User(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }


}
