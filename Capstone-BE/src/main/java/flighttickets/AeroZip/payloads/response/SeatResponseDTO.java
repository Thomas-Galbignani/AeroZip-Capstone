package flighttickets.AeroZip.payloads.response;

public record SeatResponseDTO(
        long flightId,
        String seat,
        String seatClass
) {
}