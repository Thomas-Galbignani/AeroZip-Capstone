package flighttickets.AeroZip.configs.security;

import flighttickets.AeroZip.entities.User;
import flighttickets.AeroZip.exceptions.UnauthorizedException;
import flighttickets.AeroZip.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;


@Component
public class JWTFilter extends OncePerRequestFilter {

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new UnauthorizedException("Inserire il token nel formato corretto nell'header Authorization");
        }

        String token = header.replace("Bearer ", "");
        jwtTools.verificaToken(token);

        UUID userId = jwtTools.extractId(token);
        System.out.println("aaaaaaaaaa " + userId);
        User user = userService.findById(userId);

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest req) {
        String path = req.getServletPath();
        return path.startsWith("/api/auth") || path.startsWith("/api/airports") || path.startsWith("/api/flights");
    }

}
