package art.example.server.service;

import art.example.server.dto.OrderRequest;
import art.example.server.dto.OrderResponse;
import art.example.server.model.Order;
import art.example.server.model.Product;
import art.example.server.model.User;
import art.example.server.repository.OrderRepository;
import art.example.server.repository.ProductRepository;
import art.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public OrderResponse createOrder(
            OrderRequest request,
            String buyerId
    ){
        Product product  = productRepository.findById(request.getProductId())
                .orElseThrow(()-> new RuntimeException("Product not found"));

        if(!product.getStatus().equals("ACTIVE")){
            throw  new RuntimeException("Product is not avaliable for purchase");
        }

        if(product.getStock() < request.getQuantity()){
            throw new RuntimeException("Insufficient stock. Available:" + product.getStock());
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(()-> new RuntimeException("Buyer not found"));
    }
}
