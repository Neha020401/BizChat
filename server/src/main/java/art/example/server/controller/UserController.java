package art.example.server.controller;

import art.example.server.model.User;
import art.example.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/BizChat/api/userss")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity getCurrentUserProfile(Authentication authentication){
try{
    String userId = (String) authentication.getPrincipal();
    User user = userService.getUserById(userId);

    user.setPassword(null);

    return  ResponseEntity.ok(user);
}catch (RuntimeException e){
    return  ResponseEntity.badRequest().body(e.getMessage());
}
    }

    @GetMapping("/{id}")
    public ResponseEntity getUserById(@PathVariable String id) {
        try {
            User user = userService.getUserById(id);

            // Don't send password
            user.setPassword(null);

            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody User.Profile updatedProfile,
            Authentication authentication) {
        try {
            String userId = (String) authentication.getPrincipal();
            User user = userService.updateProfile(userId, updatedProfile);

            // Don't send password
            user.setPassword(null);

            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/sellers")
    public ResponseEntity<List<User>> getAllSellers() {
        List<User> sellers = userService.getAllSellers();
        // Remove passwords
        sellers.forEach(seller -> seller.setPassword(null));
        return ResponseEntity.ok(sellers);
    }

        }
