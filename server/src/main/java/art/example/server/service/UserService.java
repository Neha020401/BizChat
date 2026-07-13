package art.example.server.service;

import art.example.server.model.User;
import art.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    public UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserById(String userId){
        return userRepository.findById(userId)
        .orElseThrow(()-> new RuntimeException("User not found"));
    }

    public  User getUserByEmail(String email){
        return userRepository.findByEmailAndIsActive(email,true)
                .orElseThrow(()->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found or account inactive"
                        ));
//                .orElseThrow(()-> new RuntimeException("User Email  not found"));
    }

    public User updateProfile(String userId, User.Profile updateProfile){
        User user  =  getUserById(userId);
        user.setProfile(updateProfile);
        user.setUpdatedAt(LocalDateTime.now());
        return  userRepository.save(user);
    }

    public boolean  emailExists(String  email){
            return   userRepository.existsByEmail(email);
    }

    public boolean existByUserName(String userName){
        return userRepository.existsByProfileUserName(userName);
    }
    public List<User> getAllSellers(){
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
        .filter(user -> user.getRole().equals("SELLER") || user.getRole().equals("BOTH"))
        .collect(Collectors.toList());
    }

    public  String deleteUser(String userId){
            User user = getUserById(userId);
            userRepository.delete(user);
            return "UserId: " + userId +" account is deleted permanently. No recovery back";
    }

    public String deactiveUser(String userId){
        User user = getUserById(userId);
        user.setActive(false);
        userRepository.save(user);
        return "UserId: " + userId +" account deactivated ";
    }

    public  User createUser(String email, String password, String role){
        if(userRepository.existsByEmail(email)){
            throw  new RuntimeException("Email Already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return  userRepository.save(user);
    }
}
