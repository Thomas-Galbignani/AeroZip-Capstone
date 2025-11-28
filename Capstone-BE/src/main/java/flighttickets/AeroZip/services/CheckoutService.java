package flighttickets.AeroZip.services;

import flighttickets.AeroZip.entities.Reservation;
import flighttickets.AeroZip.enums.ReservationStatus;
import flighttickets.AeroZip.payloads.response.PassengerWithTicketsDTO;
import flighttickets.AeroZip.payloads.response.ReservationSummaryDTO;
import flighttickets.AeroZip.repositories.ReservationRepository;
import flighttickets.AeroZip.tools.MailgunSender;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;
    private final PdfService pdfService;
    private final MailgunSender mailgunSender;

    @Transactional
    public void checkout(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(ReservationStatus.PAID);
        reservationRepository.save(reservation);

        ReservationSummaryDTO summary = reservationService.getReservationSummary(reservationId);

        // Genera un PDF per ogni passeggero
        List<byte[]> pdfs = new ArrayList<>();
        for (PassengerWithTicketsDTO passenger : summary.passengers()) {
            pdfs.add(pdfService.generatePassengerTicketPdf(summary, passenger));
        }

        // Invia una sola mail con tutti i PDF allegati
        mailgunSender.sendMultipleTicketEmail(summary.user().email(), pdfs);
    }
}
