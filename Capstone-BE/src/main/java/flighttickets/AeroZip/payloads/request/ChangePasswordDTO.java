package flighttickets.AeroZip.payloads.request;

public record ChangePasswordDTO(
        String oldPassword,
        String newPassword
) {
}
