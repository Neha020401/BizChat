package art.example.server.service;

import art.example.server.model.User;
import art.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class UserService {

    @Autowired
    public UserRepository userRepository;

    public  User createUser(String email, String password, String role){
        if(userRepository.existsByEmail(email)){
            throw  new RuntimeException("Email Already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);

        return  userRepository.save(user);
    }
}
