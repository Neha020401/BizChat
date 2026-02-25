package art.example.server.service;

import art.example.server.model.User;
import art.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    public UserRepository userRepository;

    public User getUserById(String userId){
        return userRepository.findById(userId)
        .orElseThrow(()-> new RuntimeException("User not found"));
    }

    public  User getUserByEmail(String email){
        return userRepository.findById(email)
                .orElseThrow(()-> new RuntimeException("User not found"));
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

    public List<User> getAllSellers(){
List<User> allUsers = userRepository.findAll();
return allUsers.stream()
        .filter(user -> user.getRole().equals("SELLER") || user.getRole().equals("BOTH"))
        .collect(Collectors.toList());
    }
public  void deleteUser(String userId){
        User user = getUserById(userId);
        userRepository.delete(user);
}


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
