package art.example.server.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

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

    //Validate token
    if(StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)){
        //Get  userId  from token
        String userId = tokenProvider.getUserIdFromToken(jwt);

        //Create authentication object
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userId,null,new ArrayList<>());

        //Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
} catch (Exception e ) {
    logger.error("Could not set user authentication  in security context", e);
}
//Continue filter chain
filterChain.doFilter(request,response);
    }

    //Extract  JWT  from Authorization header
    private  String  getJwtFromRequest(HttpServletRequest request){
String bearerToken = request.getHeader("Authorization");
if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")){
    return bearerToken.substring(7);
}
return null ;
    }


}
