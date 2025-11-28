package flighttickets.AeroZip.payloads.response;

import java.util.UUID;

public record UserMeDTO(
        UUID id,
        String name,
        String surname,
        String phone,
        String email
) {
}