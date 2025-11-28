package flighttickets.AeroZip.payloads.request;

import java.util.List;

public record ReservationRequestDTO(
        Long departingFlightId,
        Long returningFlightId,
        List<PassengerDTO> passengers

) {
}
