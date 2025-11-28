package flighttickets.AeroZip.payloads.response;

import java.util.List;

public record PassengerWithTicketsDTO(
        String name,
        String surname,
        String email,
        String phone,
        int baggageNumber,
        List<SeatResponseDTO> tickets
) {
}