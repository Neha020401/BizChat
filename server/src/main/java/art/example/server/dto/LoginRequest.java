package art.example.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Please enter your mail id")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Please enter your password")
    private String password;

}
