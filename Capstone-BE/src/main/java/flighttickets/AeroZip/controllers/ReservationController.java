package flighttickets.AeroZip.controllers;

import flighttickets.AeroZip.entities.User;
import flighttickets.AeroZip.payloads.request.FlightAssignmentDTO;
import flighttickets.AeroZip.payloads.request.PassengerDTO;
import flighttickets.AeroZip.payloads.request.ReservationRequestDTO;
import flighttickets.AeroZip.payloads.request.SeatDTO;
import flighttickets.AeroZip.payloads.response.ReservationResponseDTO;
import flighttickets.AeroZip.services.CheckoutService;
import flighttickets.AeroZip.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    @Autowired
    ReservationService reservationService;
    @Autowired
    CheckoutService checkoutService;


    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(
            Authentication authentication, @RequestBody ReservationRequestDTO requestDTO) {
        ReservationResponseDTO response = reservationService.createReservation(requestDTO, (User) authentication.getPrincipal());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> updateReservation(
            @PathVariable UUID id,
            @RequestBody ReservationRequestDTO requestDTO) {
        ReservationResponseDTO response = reservationService.updateReservation(id, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/{id}/flights")
    public ResponseEntity<ReservationResponseDTO> assignFlights(
            @PathVariable UUID id,
            @RequestBody FlightAssignmentDTO dto) {
        ReservationResponseDTO response = reservationService.assignFlights(id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/{id}/passengers")
    public ResponseEntity<ReservationResponseDTO> addPassengers(
            @PathVariable UUID id,
            @RequestBody List<PassengerDTO> passengers) {
        ReservationResponseDTO response = reservationService.addPassengers(id, passengers);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{id}/tickets")
    public ResponseEntity<ReservationResponseDTO> addTickets(
            @PathVariable UUID id,
            @RequestBody List<SeatDTO> seats) {
        ReservationResponseDTO response = reservationService.addTickets(id, seats);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable UUID id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204
    }

    @DeleteMapping("/{reservationId}/passengers/{email}")
    public ResponseEntity<Void> deletePassengerFromReservation(
            @PathVariable UUID reservationId,
            @PathVariable String email) {
        reservationService.deletePassengerFromReservation(reservationId, email);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204
    }

    // per il pagamento/ invio pdf
    @PostMapping("/{reservationId}/checkout")
    public ResponseEntity<Void> checkoutReservation(@PathVariable UUID reservationId) {
        checkoutService.checkout(reservationId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
