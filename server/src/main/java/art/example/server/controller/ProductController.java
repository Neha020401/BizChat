package art.example.server.controller;

import art.example.server.dto.ProductRequest;
import art.example.server.dto.ProductResponse;
import art.example.server.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/BizChat/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest request, Authentication authentication ){
        try{
            String sellerId =  (String)  authentication.getPrincipal();
            ProductResponse response = productService.createProduct(request,sellerId);
            return  ResponseEntity.ok(response);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(){
        List product = productService.getAllActiveProduct();
        return ResponseEntity.ok(product);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id){
    try{
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<?>> getProductBySeller(@PathVariable String  sellerId){
    List<?> products = productService.getProductBySeller(sellerId);
    return ResponseEntity.ok(products);
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<?>> getMyProducts(Authentication authentication){
        String sellerId = (String) authentication.getPrincipal();
        List<?> products = productService.getProductBySeller(sellerId);
        return ResponseEntity.ok(products);

    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<?>> getProductsByCategory(@PathVariable String category){
        List<?> products = productService.getProductByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<?>> searchProducts(@RequestParam String Keyword){
List<?> products = productService.searchProduct(Keyword);
return  ResponseEntity.ok(products);
    }

    @GetMapping("/filter/price")
    public ResponseEntity<List<?>> filterByPrice(@RequestParam Double minPrice, @RequestParam Double maxPrice){
        List<?> Products = productService.filterByPrice(minPrice,maxPrice);
        return  ResponseEntity.ok(Products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @Valid @RequestBody  ProductRequest request,
                                        Authentication authentication){
        try{
            String userId = (String) authentication.getPrincipal();
            ProductResponse response = productService.updateProduct(id,request,userId);
            return  ResponseEntity.ok(response);
            } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
