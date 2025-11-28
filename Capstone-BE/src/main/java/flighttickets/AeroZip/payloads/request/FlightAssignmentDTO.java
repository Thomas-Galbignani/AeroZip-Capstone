package flighttickets.AeroZip.payloads.request;


public record FlightAssignmentDTO(
        Long departingFlightId,
        Long returningFlightId // può essere null per voli di sola andata
) {
}