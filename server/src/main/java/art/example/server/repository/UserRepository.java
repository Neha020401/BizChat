package art.example.server.repository;

import art.example.server.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User,String> {
    Optional findByEmail(String email);
    Boolean  existsByEmail(String email);
    List findByRole(String role);
    List findByProfileName(String name);
    Optional findByEmailAndRole(String email, String role);
}
