package art.example.server.service;

import art.example.server.dto.AuthResponse;
import art.example.server.dto.SignupRequest;
import art.example.server.model.User;
import art.example.server.repository.UserRepository;
import art.example.server.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse signup(SignupRequest request){
if(userRepository.existsByEmail(request.getEmail())){
throw  new RuntimeException("Email is already registered");
}
if(!request.getRole().equals("BUYER")&&
   !request.getRole().equals("SELLER")&&
   !request.getRole().equals("BOTH")
){
  throw new RuntimeException("Invalid Role, The role must be Buyer, Seller, or Both");
}
        User user = new User();
user.setEmail(request.getEmail());
user.setRole(request.getRole());
user.setPassword(passwordEncoder.encode(request.getPassword()));

User.Profile profile = new User.Profile();
profile.setName(request.getName());
profile.setBio(request.getBio());
profile.setPhone(request.getPhoneno());

User savedUser = userRepository.save(user);

String token = jwtTokenProvider.generateToken(savedUser.getId(),savedUser.getEmail());

return new AuthResponse(
        token,
        savedUser.getId(),
        savedUser.getEmail(),
        savedUser.getProfile().getName(),
        savedUser.getRole()
);
    }



}