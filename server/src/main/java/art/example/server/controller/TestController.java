package art.example.server.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/BizChat/test/api")
public class TestController {

    @GetMapping("/hello")
    public String greet(){
        return "Hello there,Welcome to BiZChat";
    }

    @GetMapping("/protected")
    public String  protectedEndPoint(Authentication authentication){
        String userId =  (String) authentication.getPrincipal();
        return  "Hello User! Your ID is: " + userId;
    }
}
