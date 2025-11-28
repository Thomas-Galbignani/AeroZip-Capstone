package flighttickets.AeroZip.controllers;


import flighttickets.AeroZip.entities.User;
import flighttickets.AeroZip.payloads.request.ChangePasswordDTO;
import flighttickets.AeroZip.payloads.response.UserMeDTO;
import flighttickets.AeroZip.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/me")
    public UserMeDTO getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return new UserMeDTO(user.getId(), user.getName(), user.getSurname(), user.getPhone(), user.getEmail());
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        userService.deleteUser(user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/me")
    public ResponseEntity<UserMeDTO> updateCurrentUser(
            Authentication authentication,
            @RequestBody Map<String, Object> updates) {

        User user = (User) authentication.getPrincipal();
        User updatedUser = userService.updateUserPartial(user.getId(), updates);

        return ResponseEntity.ok(new UserMeDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getSurname(),
                updatedUser.getPhone(),
                updatedUser.getEmail()
        ));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> cambioPassword(
            Authentication authentication,
            @RequestBody ChangePasswordDTO changePasswordDTO) {

        User user = (User) authentication.getPrincipal();

        userService.changePassword(
                user.getId(),
                changePasswordDTO.oldPassword(),
                changePasswordDTO.newPassword()
        );

        return ResponseEntity.ok().build();
    }
}
