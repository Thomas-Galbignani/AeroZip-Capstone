package flighttickets.AeroZip.payloads.response;

public record FlightDTO(
        Long id,
        String companyName,
        String companyAvatar,
        String flightCode,
        String flightTime,
        String layover,
        String departureTime,
        String arrivalTime,
        long totalPrice,
        long businessClassCostPerPerson,
        Long departureAirportId,
        Long arrivalAirportId,
        String date
) {
}
