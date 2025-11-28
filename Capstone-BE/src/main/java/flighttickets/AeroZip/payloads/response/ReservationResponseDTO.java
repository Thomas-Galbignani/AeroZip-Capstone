package flighttickets.AeroZip.payloads.response;

import java.util.List;
import java.util.UUID;

public record ReservationResponseDTO(
        UUID reservationId,
        String status,
        List<PassengerResponseDTO> passengers
) {
}