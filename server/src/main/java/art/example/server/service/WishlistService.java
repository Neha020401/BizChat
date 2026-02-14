package art.example.server.service;

import art.example.server.dto.ProductResponse;
import art.example.server.model.Product;
import art.example.server.model.User;
import art.example.server.model.Wishlist;
import art.example.server.repository.ProductRepository;
import art.example.server.repository.UserRepository;
import art.example.server.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public  String addToWishList(String userId, String productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new RuntimeException("Product not found"));

        if(wishlistRepository.existsByUserIdAndProductId(userId,productId)){
            throw new RuntimeException("Product already in WishList");
        }

    Wishlist wishList = new Wishlist();

        wishList.setUserId(userId);
        wishList.setProductId(productId);
        wishlistRepository.save(wishList);

        return "Product added to the list";
    }

    public List<?> getWishList(String userId){
        List<Wishlist> wishlistItems = wishlistRepository.findByUserId(userId);

        return wishlistItems.stream()
                .map(item->{
                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    if(product == null) return  null ;

                    User seller =  userRepository.findById(product.getSellerId()).orElse(null);
                    return  mapProductToResponse(product,seller);
                } )
                .filter(item -> item != null)
                .collect(Collectors.toList());
    }

    public ProductResponse mapProductToResponse(Product product,  User seller){
        ProductResponse response =  new ProductResponse();
        response.setId(product.getId());
        response.setSellerId(product.getSellerId());
        response.setSellerName(seller != null ?  seller.getProfile().getName():"Unknown");
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
            dims.setHeight(product.getDimensions().getHeight());
            dims.setWidth(product.getDimensions().getWidth());
            dims.setUnit(product.getDimensions().getUnit());
            response.setDimensions(dims);
        }
            return  response;
    }
}
