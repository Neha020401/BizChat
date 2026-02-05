package art.example.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class OrderResponse {

    private  String id;
    private String buyerId;
    private String buyerName;
    private String sellerId;
    private String sellerName;
    private String productId;
    private String productTitle;
    private Integer quantity;
    private Double totalPrice;
    private String status;
    private  ShippingAddressDTO shippingAddress;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public  static  class ShippingAddressDTO{
        private String country;
        private String state ;
        private String zipCode;
        private String street;
        private String city;
        private String phone ;

    }





}
