package art.example.server.controller;

import art.example.server.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/BizChat/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;



    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishList(
            @PathVariable String productId,
            Authentication authentication
    ){
        try{
    String userId = (String) authentication.getPrincipal();
    String message = wishlistService.addToWishList(userId,productId);
    return  ResponseEntity.ok(message + " Product Added to Wishlist");
        } catch (RuntimeException e){
    return  ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping
    public ResponseEntity<List> getWishlist(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        List wishlist = wishlistService.getWishList(userId);
        return ResponseEntity.ok(wishlist);
    }


    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishList(
            @PathVariable String  productId,
            Authentication authentication
    ){
        try{
            String userId = (String) authentication.getPrincipal();
            String message = wishlistService.removeFromWishList(userId,productId);
            return ResponseEntity.ok(message + " Product Removed from the WishList");
        }catch (RuntimeException e){
            return  ResponseEntity.badRequest().body(e.getMessage());
        }

    }



    @GetMapping("/check/{productId}")
    public ResponseEntity<?>  isInWishlist(
            @PathVariable String productId,
            Authentication authentication
    ){
String userId = (String) authentication.getPrincipal();
Boolean Present = wishlistService.isInWishlist(userId,productId);
String message = Present ? " Product is Present in the WishList" : " Product is not Present in the WishList";
return  ResponseEntity.ok(Present + message );
     }


}
