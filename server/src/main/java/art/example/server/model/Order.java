package art.example.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;

    @Indexed
    private String buyerId;

    @Indexed
    private String sellerId;

    @Indexed
    private String productId ;

    private String productTitle;

    private  Integer quantity;

    private Double totalPrice ;

    private String status;

    private ShippingAddress shippingAddress ;

    private String paymentStatus;

    private LocalDateTime createdAt;

    private  LocalDateTime updatedAt;

    @Data
    public static class ShippingAddress{
        private String street;
        private String city;
        private String state;
        private String zipCode ;
        private String country ;
        private String  phone;
    }

    public Order(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "PENDING";
        this.paymentStatus = "PENDING";
    }


}
