package art.example.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "products")
public class Product {

    @Id
    private String Id;

    @Indexed
    private String SellerId;

    private String description;

    private Double price;

    private String category; // "PAINTING", "SCULPTURE", "DIGITAL", "PHOTOGRAPHY", "OTHER"

    private List images  = new ArrayList<>(); // URLs or Base64 strings

    private Integer stock ;

    private String title ;

    private String status; // "ACTIVE", "SOLD", "DRAFT"

    private List tag = new ArrayList<>(); // ["abstract", "modern", "colorful"]

    private Dimensions  dimensions;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    public static  class Dimensions{
        private Double  width ;
        private Double height ;
        private String unit ; // "inch", "cm", "px"
    }

    public Product(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "ACTIVE";
        this.stock = 1;

    }



}
