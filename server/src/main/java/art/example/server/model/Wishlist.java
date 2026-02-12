package art.example.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "wishlist")
@CompoundIndex(name="user_product", def = "{'userId':1, 'productId':1}",unique = true)
public class Wishlist {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String productId;

    private LocalDateTime addedAt;

    public Wishlist(){
        this.addedAt = LocalDateTime.now();
    }
}
