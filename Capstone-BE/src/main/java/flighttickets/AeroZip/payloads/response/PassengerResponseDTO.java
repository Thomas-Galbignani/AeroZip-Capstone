package flighttickets.AeroZip.payloads.response;

import java.util.List;

public record PassengerResponseDTO(
        String name,
        String surname,
        String mail,
        List<SeatResponseDTO> seats
) {
}