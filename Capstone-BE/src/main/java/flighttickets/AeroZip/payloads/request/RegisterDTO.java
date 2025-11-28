package flighttickets.AeroZip.payloads.request;

public record RegisterDTO(
        String name,
        String surname,
        String phone,
        String email,
        String password
) {
}