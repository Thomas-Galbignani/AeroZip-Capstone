package flighttickets.AeroZip.payloads.request;

public record SeatDTO(
        Long flightId,
        String seat,
        String seatClass,
        String passengerMail
) {
 
}
