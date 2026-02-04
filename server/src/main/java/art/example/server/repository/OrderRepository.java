package art.example.server.repository;

import art.example.server.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByBuyerId(String buyerId);
    List<Order> findBySellerId(String sellerId);
    List<Order> findByStatus(String status);
    List<Order> findByBuyerIdAndStatus(String buyerId, String status);
    List<Order> findBySellerAndStatus(String sellerId,String status);
    List<Order> findByProduct(String productId);
}
