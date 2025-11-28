package flighttickets.AeroZip.controllers;

import flighttickets.AeroZip.configs.security.JWTTools;
import flighttickets.AeroZip.entities.User;
import flighttickets.AeroZip.payloads.request.LoginDTO;
import flighttickets.AeroZip.payloads.request.RegisterDTO;
import flighttickets.AeroZip.payloads.response.AuthResponseDTO;
import flighttickets.AeroZip.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    AuthService authService;
    @Autowired
    JWTTools jwtTools;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDTO body) {
        User user = authService.register(
                body.name(),
                body.surname(),
                body.phone(),
                body.email(),
                body.password()
        );

        String token = jwtTools.creaToken(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponseDTO(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO body) {
        User user = authService.authenticate(body.email(), body.password());
        String token = jwtTools.creaToken(user);
        return ResponseEntity.status(HttpStatus.OK).body(new AuthResponseDTO(token));
    }


}
