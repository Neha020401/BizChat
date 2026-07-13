package art.example.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @Email(message = "Email should be valid")
    private String email;

    private String userName;

    @NotBlank(message = "Please enter your password")
    private String password;


}
