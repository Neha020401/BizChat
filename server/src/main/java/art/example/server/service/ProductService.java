package art.example.server.service;

import art.example.server.dto.ProductRequest;
import art.example.server.dto.ProductResponse;
import art.example.server.model.Product;
import art.example.server.model.User;
import art.example.server.repository.ProductRepository;
import art.example.server.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public ProductResponse createProduct(ProductRequest request, String sellerId){
        User seller = userRepository.findById(sellerId).
                orElseThrow(()->new RuntimeException("Seller not found"));

        if(!seller.getRole().equals("SELLER") && ! seller.getRole().equals("BOTH")){
            throw  new RuntimeException("User is not authorized to sell products ");
        }
        validateCategory(request.getCategory());

        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setSellerId(sellerId);
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImages(request.getImages());
        product.setStock(request.getStock());
        product.setStatus(request.getStatus());
        product.setTag(request.getTag());

        if(request.getDimensions()!=null){
            Product.Dimensions dims =  new Product.Dimensions();
            dims.setWidth(request.getDimensions().getWidth());
            dims.setHeight(request.getDimensions().getHeight());
            dims.setUnit(request.getDimensions().getUnit());
            product.setDimensions(dims);
        }
        Product savedProduct = (Product) productRepository.save(product);
        return mapToResponse(savedProduct, seller);
    }

    public List<ProductResponse> getAllActiveProduct(){
        List<Product> products = productRepository.findByStatus("ACTIVE");
        return products.stream()
                .map(this::mapToResponseWithSeller)
                .collect(Collectors.toList());
    }



    public ProductResponse getProductById(String id){
Product product = productRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("Product not found "));
return  mapToResponseWithSeller(product);
    }


    public List<ProductResponse> getProductBySeller(String sellerId){
        List<Product> products = productRepository.findBySellerId(sellerId);
        return products.stream()
                .map(this::mapToResponseWithSeller)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductByCategory(String category){
        List<Product> product = productRepository.findByCategoryAndStatus(category,"ACTIVE");
        return product.stream()
                .map(this::mapToResponseWithSeller)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchProduct(String keyword){
        List<Product> product = productRepository.searchByTitle(keyword);
        return product.stream()
                .map(this::mapToResponseWithSeller)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> filterByPrice(Double maxPrice, Double minPrice){
        List<Product> product = productRepository.findByPriceBetweenAndStatus(minPrice,maxPrice,"ACTIVE");
        return  product.stream()
                .map(this::mapToResponseWithSeller)
                .collect(Collectors.toList());

    }

    public ProductResponse updateProduct(String productId, ProductRequest request,String userId){
        Product product  = productRepository.findById(productId)
        .orElseThrow(()-> new RuntimeException("Product no found"));

        if(!product.getSellerId().equals(userId)){
            throw new RuntimeException("You are not athourized  to update  this product");
        }

        validateCategory(request.getCategory());

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImages(request.getImages());
        product.setStock(request.getStock());
        product.setStatus(request.getStatus());
        product.setTag(request.getTag());
        product.setUpdatedAt(LocalDateTime.now());

        // Update dimensions
        if (request.getDimensions() != null) {
            Product.Dimensions dims = new Product.Dimensions();
            dims.setWidth(request.getDimensions().getWidth());
            dims.setHeight(request.getDimensions().getHeight());
            dims.setUnit(request.getDimensions().getUnit());
            product.setDimensions(dims);
        }

        // Save
        Product updatedProduct = productRepository.save(product);
        return mapToResponseWithSeller(updatedProduct);

    }

    public void deleteProduct(String productId, String userId){
        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new RuntimeException("Product not found"));

        if(!product.getSellerId().equals(userId)){
            throw new RuntimeException("You are not authorzied to delete this product");
        }

        productRepository.delete(product);
    }

    private void validateCategory(String category) {
        List<String> validCategories  = List.of("PAINTING","SCULPTURE","DIGITAL","PHOTOGRAPHY","OTHER");
        if(!validCategories.contains(category)){
            throw new RuntimeException("Invalid category. Must be one of: " + validCategories);
        }
    }

    private ProductResponse mapToResponse(Product product, User seller) {
        ProductResponse response  = new ProductResponse();
        response.setId(product.getId());
        response.setSellerId(product.getSellerId());
        response.setSellerName(seller != null ? seller.getProfile().getName():"Unknown");
        response.setTitle(product.getTitle());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setCategory(product.getCategory());
        response.setImages(product.getImages());
        response.setStock(product.getStock());
        response.setStatus(product.getStatus());
        response.setTag(product.getTag());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());


        if(product.getDimensions() != null){
            ProductResponse.DimensionsDTO dims = new ProductResponse.DimensionsDTO();
            dims.setWidth(product.getDimensions().getWidth());
            dims.setHeight(product.getDimensions().getHeight());
            dims.setUnit(product.getDimensions().getUnit());
            response.setDimensions(dims);
        }
        return response;
    }

    private ProductResponse mapToResponseWithSeller(Product product) {
        User seller = userRepository.findById(product.getSellerId()).orElse(null);
        return mapToResponse(product, seller);
    }


}
