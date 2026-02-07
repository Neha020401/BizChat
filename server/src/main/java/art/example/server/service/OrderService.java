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

        Double totalPrice = product.getPrice() * request.getQuantity();

        Order order = new Order();
        order.setBuyerId(buyerId);
        order.setSellerId(product.getSellerId());
        order.setProductId(product.getId());
        order.setProductTitle(product.getTitle());
        order.setQuantity(request.getQuantity());
        order.setTotalPrice(totalPrice);

        Order.ShippingAddress address = new Order.ShippingAddress();

        address.setStreet(request.getShippingAddress().getStreet());
        address.setCity(request.getShippingAddress().getCity());
        address.setState(request.getShippingAddress().getState());
        address.setZipCode(request.getShippingAddress().getZipCode());
        address.setPhone(request.getShippingAddress().getPhone());
        order.setShippingAddress(address);

        product.setStock(product.getStock() -request.getQuantity());
        if(product.getStock() == 0){
            product.setStatus("SOLD");
        }
        productRepository.save(product);

        Order savedOrder  = orderRepository.save(order);

        return mapToResponse(savedOrder);
    }


    private OrderResponse mapToResponse(Order order){
        User buyer = userRepository.findById(order.getBuyerId()).orElse(null);
        User seller =  userRepository.findById(order.getSellerId()).orElse(null);

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setBuyerId(order.getBuyerId());
        response.setBuyerName(buyer != null ?buyer.getProfile().getName(): "Unknown");
        response.setSellerName(seller != null ? seller.getProfile().getName() : "Unknown");
        response.setSellerId(order.getSellerId());
        response.setProductId(order.getProductId());
        response.setProductTitle(order.getProductTitle());
        response.setQuantity(order.getQuantity());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        if(order.getShippingAddress() != null){
            OrderResponse.ShippingAddressDTO address = new OrderResponse.ShippingAddressDTO();
            address.setState(order.getShippingAddress().getState());
            address.setCity(order.getShippingAddress().getCity());
            address.setCountry(order.getShippingAddress().getCountry());
            address.setStreet(order.getShippingAddress().getStreet());
            address.setPhone(order.getShippingAddress().getPhone());
            address.setZipCode(order.getShippingAddress().getZipCode());
            response.setShippingAddress(address);
        }

        return response;


    }
}
