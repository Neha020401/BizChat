package art.example.server.service;

import art.example.server.dto.OrderRequest;
import art.example.server.dto.OrderResponse;
import art.example.server.model.Order;
import art.example.server.model.Product;
import art.example.server.model.User;
import art.example.server.repository.OrderRepository;
import art.example.server.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private  UserService userService;

    @Autowired
    private  NotificationService notificationService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;


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

        User buyer = userService.getUserById(buyerId);

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

        notificationService.createNotification(
                savedOrder.getSellerId(),
                "ORDER",
                "NEW ORDER RECEIVED ",
                    "You have received  a new order  for" + product.getTitle(),
                savedOrder.getId()
        );

        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getBuyerOrders(String buyerId){
        List<Order> orders = orderRepository.findByBuyerId(buyerId);
        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getSellerOrders(String sellerId){
        List<Order> orders = orderRepository.findBySellerId(sellerId);
        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(String orderId, String userId){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new RuntimeException("Order not found"));
        if(!order.getBuyerId().equals(userId) && !order.getSellerId().equals(userId)){
            throw  new RuntimeException("You are not authorized to view this order");
        }

        return mapToResponse(order);
    }

    public OrderResponse updateOrderStatus(String orderId,String status, String sellerId){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new RuntimeException(" Order not found"));

        if(!order.getSellerId().equals(sellerId)){
            throw  new RuntimeException("you are not authorized to update  this order");
        }

        List<String> validStatus = List.of("PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELLED");
        if(!validStatus.contains(status)){
            throw new RuntimeException("Invalid status");
        }

        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        if(status.equals("CANCELLED")){
            Product product = productRepository.findById(order.getProductId()).orElse(null);
            if(product != null){
                product.setStock(product.getStock()  +order.getQuantity());
                product.setStatus("ACTIVE");
                productRepository.save(product);
            }
        }
        Order updateOrder = orderRepository.save(order);

        String notificationMessage = "Your order status  has been  updated to " +  status;
        notificationService.createNotification(
                order.getBuyerId(),
                "STATUS UPDATE",
                "Order  Status  Updated",
                notificationMessage,
                orderId
        );

        return  mapToResponse(updateOrder);
    }

    public OrderResponse cancelOrder(String orderId, String buyerId){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new RuntimeException(" Order not found "));

        if(!order.getBuyerId().equals(buyerId)){
            throw new RuntimeException("You are not authorized to cancel this order");
        }

        if(!order.getStatus().equals("PENDING")){
            throw  new RuntimeException("Cannot cancel the order. Currect Status: " + order.getStatus());
        }

        order.setStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());

        Product product = productRepository.findById(order.getProductId()).orElse(null);
        if(product != null){
            product.setStock(product.getStock() + order.getQuantity());
            product.setStatus("ACTIVE");
            productRepository.save(product);
        }

        Order updateOrder = orderRepository.save(order);
        return  mapToResponse(updateOrder);
    }

    private OrderResponse mapToResponse(Order order){
        User buyer = userService.getUserById(order.getBuyerId());
        User seller =  userService.getUserById(order.getSellerId());

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
