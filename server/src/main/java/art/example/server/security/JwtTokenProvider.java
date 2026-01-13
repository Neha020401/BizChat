package art.example.server.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiratonMs;

    private Key getSignKey(){
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String userId, String email){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiratonMs);

        return Jwts.builder()
                .setSubject(userId)
                .claim("email",email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSignKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserIdFromToken(String token){
       Claims claims = Jwts.parserBuilder()
               .setSigningKey(getSignKey())
               .build()
               .parseClaimsJws(token)
               .getBody();

       return claims.getSubject();
    }

    public boolean validateToken(String token){
        try{
            Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        }catch (JwtException | IllegalArgumentException e){
System.out.print("Invalid JWT token: " + e.getMessage());
        }
        return  false;
    }

}
