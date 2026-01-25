package art.example.server.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private String id;
    private String sellerId;
    private String sellerName;
    private String title;
    private String description;
    private Double price ;
    private String category;
    private List<String> images ;
    private Integer stock;
    private String status;
    private List<String> tag;
    private DimensionsDTO dimensions ;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DimensionsDTO{
        private Double width ;
        private Double height ;
        private String unit ;
    }
}
