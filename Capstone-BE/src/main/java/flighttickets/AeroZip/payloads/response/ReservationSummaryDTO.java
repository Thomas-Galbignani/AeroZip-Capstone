package flighttickets.AeroZip.payloads.response;

import java.util.List;
import java.util.UUID;

public record ReservationSummaryDTO(
        UUID reservationId,
        String status,
        UserMeDTO user,
        FlightDTO departingFlight,
        FlightDTO returningFlight,
        List<PassengerWithTicketsDTO> passengers) {
}
