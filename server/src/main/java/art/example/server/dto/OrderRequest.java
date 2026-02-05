package art.example.server.dto;

import art.example.server.model.Order;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class OrderRequest {

    @NotBlank(message = "Product Id is required")
    private String productId;

    @NotBlank(message = "Quantity is required")
    @Positive(message = "Quantity must be postive")
    private Integer quantity ;

    @NotBlank(message = "Shipping address must not be Blank")
    private ShippingAddress shippingAddress;

    @Data
    public static class ShippingAddress{

    @NotBlank(message = "Street is required")
    private String street ;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
     private  String State ;

    @NotBlank(message = "Zipcode")
    private String zipCode ;

    @NotBlank(message = "Country")
    private String country;

    @NotBlank(message = "Phone no ")
    private String phone ;

    }
}
