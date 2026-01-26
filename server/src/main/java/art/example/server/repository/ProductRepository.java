package art.example.server.repository;

import art.example.server.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product,String> {

    List<Product> findBySellerId(String sellerId);
    List<Product> findByCategory(String category);
    List<Product> findByStatus(String status);
    List<Product> findByCategoryAndStatus(String category, String status);
    List<Product> findBySellerIdAndStatus(String sellerId, String status);

    @Query("'title':{$regex:?0, $options: 'i'},'status':'ACTIVE'")
    List<Product> searchByTitle(String keyword);

    List<Product> findByPriceBetweenAndStatus(Double minPrice, Double maxPrice, String status);

    List<Product> findByTagContainingAndStatus(String tag, String status);

}
