package flighttickets.AeroZip.payloads.request;

public record LoginDTO(
        String email,
        String password
) {
}