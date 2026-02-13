package art.example.server.service;

import art.example.server.model.Product;
import art.example.server.model.Wishlist;
import art.example.server.repository.ProductRepository;
import art.example.server.repository.UserRepository;
import art.example.server.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
