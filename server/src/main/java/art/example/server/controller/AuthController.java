package art.example.server.controller;

import art.example.server.dto.AuthResponse;
import art.example.server.dto.LoginRequest;
import art.example.server.dto.SignupRequest;
import art.example.server.repository.UserRepository;
import art.example.server.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/BizChat/verifyuser")
@CrossOrigin(origins = "*")
public class AuthController
{


    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @SuppressWarnings("rawtypes")
    @PostMapping("/signup")
    public ResponseEntity signup(@Valid @RequestBody SignupRequest request){
        try{
            AuthResponse response = authService.signup(request);
            return ResponseEntity.ok(response);

        } catch (ResponseStatusException e) {
           Map<String,String> error = new HashMap<>();
           error.put("message",e.getReason());
           return ResponseEntity.status(e.getStatusCode()).body(error);
        } catch (Exception e){
            Map<String, String> error  = new HashMap<>();
            error.put("message", "An unexpected error occured. Please  try again");
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request){
        try{
            AuthResponse response = authService.login(request);
            return  ResponseEntity.ok(response);

        } catch (ResponseStatusException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "An unexpected error occurred. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
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

}
