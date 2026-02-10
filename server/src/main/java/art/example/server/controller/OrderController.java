package art.example.server.controller;

import art.example.server.dto.OrderRequest;
import art.example.server.dto.OrderResponse;
import art.example.server.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/BizChat/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication
    ){
        try{
            String buyerId = (String) authentication.getPrincipal();
            OrderResponse response = orderService.createOrder(request,buyerId);
            return ResponseEntity.ok(response);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<?>> getMyOrders(Authentication authentication){
        String buyerId = (String) authentication.getPrincipal();
        List<?> orders = orderService.getBuyerOrders(buyerId);
        return  ResponseEntity.ok(orders);
    }

    @GetMapping("/received")
    public ResponseEntity<List<?>> getRecievedOrders(Authentication authentication){
        String sellerId = (String) authentication.getPrincipal();
        List<?> orders = orderService.getSellerOrders(sellerId);
        return  ResponseEntity.ok(orders);
    }


}
