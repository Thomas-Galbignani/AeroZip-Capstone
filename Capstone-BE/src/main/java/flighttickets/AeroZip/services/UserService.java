package flighttickets.AeroZip.services;

import flighttickets.AeroZip.entities.User;
import flighttickets.AeroZip.repositories.PlaneTicketRepository;
import flighttickets.AeroZip.repositories.ReservationRepository;
import flighttickets.AeroZip.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private PlaneTicketRepository planeTicketRepository;

    @Transactional
    public void deleteUser(UUID userId) {
        planeTicketRepository.deleteByUserIdThroughReservation(userId);
        reservationRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }

    @Transactional
    public User findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato con id " + userId));
    }

    @Transactional
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserPartial(UUID userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("surname")) user.setSurname((String) updates.get("surname"));
        if (updates.containsKey("phone")) user.setPhone((String) updates.get("phone"));
        if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));

        return userRepository.save(user);
    }


    @Transactional
    public void changePassword(UUID userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        // Verifica vecchia password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Vecchia password errata");
        }

        // nuova password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
