package art.example.server.repository;

import art.example.server.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist,String> {

    List<Wishlist> findByUserId(String userId);

    Optional<Wishlist> findByUserIdAndProductId(String userId, String productId);

    Boolean existsByUserIdAndProductId(String userId, String ProductId);

    void deleteByUserIdAndProductId(String userId, String ProductId);

}
