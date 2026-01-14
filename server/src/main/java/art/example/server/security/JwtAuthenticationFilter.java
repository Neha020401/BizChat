package art.example.server.security;

import ch.qos.logback.core.util.StringUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain
                                  ) throws ServletException, IOException {

try{
    String jwt = getJwtFromRequest(request);
    if(StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)){
        String userId = tokenProvider.getUserIdFromToken(jwt);
    }
} catch (RuntimeException e) {
    throw new RuntimeException(e);
}
    }

}
