package art.example.server.controller;

import art.example.server.dto.ProductRequest;
import art.example.server.dto.ProductResponse;
import art.example.server.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity createProduct(
            @Valid @RequestBody ProductRequest request,
            Authentication authentication ){
        try{
            String sellerId =  (String)  authentication.getPrincipal();
            ProductResponse response = productService.createProduct(request,sellerId);
            return  ResponseEntity.ok(response);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}
