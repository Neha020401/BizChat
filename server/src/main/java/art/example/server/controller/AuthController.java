package art.example.server.controller;

import art.example.server.dto.AuthResponse;
import art.example.server.dto.LoginRequest;
import art.example.server.dto.SignupRequest;
import art.example.server.repository.UserRepository;
import art.example.server.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ResourceBundle;

@RestController
@RequestMapping("/whoAreWe/StupidCreature")
@CrossOrigin(origins = "*")
public class AuthController
{

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity signup(@Valid @RequestBody SignupRequest request){
        try{
            AuthResponse response = authService.signup(request);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity login(@Valid @RequestBody LoginRequest request){
try{
    AuthResponse response = authService.login(request);
    return  ResponseEntity.ok(response);

} catch (RuntimeException e) {
    return ResponseEntity.badRequest().body(e.getMessage());
}
    }

    @GetMapping("/db-test")
    public ResponseEntity<?> testDatabase() {
        try {
            long count = userRepository.count();
            return ResponseEntity.ok("Database connected! User count: " + count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Database error: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public  ResponseEntity test(){
        return  ResponseEntity.ok("Auth endpoint working");
    }

}
