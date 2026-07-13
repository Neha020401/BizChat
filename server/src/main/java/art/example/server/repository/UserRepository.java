package art.example.server.repository;

import art.example.server.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndIsActive(String email, Boolean active);
    Boolean existsByEmail(String email);

    Long deleteByEmail(String email);

    Boolean existsByIsActive(Boolean isActive);

    List<User> findByRole(String role);

//    String findByUserName(String userName);
//    String existsByUserName(String userName);

    Optional<User> findByProfileUserName(String userName);

    boolean existsByProfileUserName(String userName);

    Optional<User> findByProfileNameAndRole(String name, String role);


}
