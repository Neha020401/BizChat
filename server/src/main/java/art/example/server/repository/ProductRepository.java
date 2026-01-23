package art.example.server.repository;

import art.example.server.model.Product;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository {

    List findBySeller(String sellerId);
    List findByCategory(String category);
    List findByStatus(String status);
    List findByCategoryAndStatus(String category, String status);
    List findBySellerAndStatus(String sellerId, String status);
    List findBySellerIdAndStatus(String sellerId, String status);

    @Query("'title':{$regex:?0, $option: 'i'},'status':'ACTIVE'")
    List searchByTitle(String keyword);

    List findByPriceBetweenAndStatus(Double minPrice, Double maxPrice, String status);

    List findByTagsContainingAndStatus(String tag, String status);

}
