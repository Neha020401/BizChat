package art.example.server.service;

import art.example.server.dto.AuthResponse;
import art.example.server.dto.LoginRequest;
import art.example.server.dto.SignupRequest;
import art.example.server.model.User;
import art.example.server.repository.UserRepository;
import art.example.server.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.Console;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        if (!request.getRole().equals("BUYER") &&
                !request.getRole().equals("SELLER") &&
                !request.getRole().equals("BOTH")) {
            throw new RuntimeException("Invalid Role, The role must be BUYER,SELLER, or BOTH");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User.Profile profile = new User.Profile();
        profile.setName(request.getName());
        profile.setBio(request.getBio());
        profile.setPhone(request.getPhoneno());

        user.setProfile(profile);

        System.out.println("Before save - User: " + user);
        User savedUser = userRepository.save(user);
        System.out.println("After save - User ID: " + savedUser.getId());
        System.out.println("After save - Full User: " + savedUser);

        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());
        System.out.println(request);
        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getProfile().getName(),
                savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email "));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid  password");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getProfile().getName(),
                user.getRole());
    }
}