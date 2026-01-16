package art.example.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2,max = 50, message = "Name should be longer than 2 and shorter the 50")
    private String name ;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password must not be empty")
    @Size(min=6, max =100,message="Password must be at least 6 charachter")
    private String password;

    @NotBlank(message = "Role must not be blank ")
    private String role;

   private String phoneno;
   private String bio;

}
