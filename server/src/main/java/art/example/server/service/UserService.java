package art.example.server.service;

import art.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class UserService {

    @Autowired
    public UserRepository userRepository;

}
