package art.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductRequest {

    @NotBlank(message = "Title is required")
    private String title ;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price must not be empty")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    private List<String> images = new ArrayList<>();

    @NotNull(message = "Stock is required")
    @Positive(message = "Stock must be positive")
    private Integer stock;

    private String status = "ACTIVE";

    private List<String> tag = new ArrayList<>();

    private DimensionsDTO dimensions;

    @Data
    public static class DimensionsDTO{
        private Double width;
        private Double height;
        private String unit;
    }
}
