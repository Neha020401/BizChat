package art.example.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private  String token;
    private String type = "Bearer";
    private  String id ;
    private String  email;
    private String name ;
    private boolean isActive;
    private String userName;
    private String role ;

    public AuthResponse(
            String token,
            String id,
            String email,
            String name,
            String role,
            String userName
            ){
this.token =token;
this.id = id;
this.name = name;
this.email = email;
this.role = role;
this.userName = userName;
    }
}


