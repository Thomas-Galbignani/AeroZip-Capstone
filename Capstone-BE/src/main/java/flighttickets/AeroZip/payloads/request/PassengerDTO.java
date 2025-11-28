package flighttickets.AeroZip.payloads.request;

import java.util.List;

public record PassengerDTO(
        String name,
        String surname,
        String birthDate,
        String mail,
        String phone,
        int baggageNumber,
        List<SeatDTO> seats
) {
}
