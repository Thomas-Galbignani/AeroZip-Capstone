package flighttickets.AeroZip.payloads.response;

public record AirportDTO(Long id,
                         String airportName,
                         String iataCode
) {
}
