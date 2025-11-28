package flighttickets.AeroZip.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import flighttickets.AeroZip.payloads.response.FlightDTO;
import flighttickets.AeroZip.payloads.response.PassengerWithTicketsDTO;
import flighttickets.AeroZip.payloads.response.ReservationSummaryDTO;
import flighttickets.AeroZip.payloads.response.SeatResponseDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class PdfService {

    public byte[] generatePassengerTicketPdf(ReservationSummaryDTO summary, PassengerWithTicketsDTO passenger) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Intestazione
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, BaseColor.BLUE);
            Paragraph header = new Paragraph("AeroZip", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            Font subHeaderFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
            Paragraph subHeader = new Paragraph("Biglietto di Viaggio", subHeaderFont);
            subHeader.setAlignment(Element.ALIGN_CENTER);
            document.add(subHeader);
            document.add(Chunk.NEWLINE);

            // Prenotazione
            Font sectionFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            document.add(new Paragraph("Prenotazione", sectionFont));
            document.add(new Paragraph("ID: " + summary.reservationId(), normalFont));
            document.add(new Paragraph("Stato: " + summary.status(), normalFont));
            document.add(Chunk.NEWLINE);

            // Passeggero
            document.add(new Paragraph("Passeggero", sectionFont));
            document.add(new Paragraph("Nome: " + passenger.name() + " " + passenger.surname(), normalFont));
            document.add(new Paragraph("Email: " + passenger.email(), normalFont));
            document.add(new Paragraph("Telefono: " + passenger.phone(), normalFont));
            document.add(new Paragraph("Bagagli: " + passenger.baggageNumber(), normalFont));
            document.add(Chunk.NEWLINE);

            // Volo
            Paragraph dettagliVolo = new Paragraph("Dettagli Volo", sectionFont);
            dettagliVolo.setSpacingAfter(5f);
            document.add(dettagliVolo);
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2f, 2f, 3f, 3f, 1.5f, 2f});

            BaseColor headerColor = BaseColor.LIGHT_GRAY;
            Font tableHeaderFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

            String[] headers = {"Codice", "Compagnia", "Partenza", "Arrivo", "Posto", "Classe"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, tableHeaderFont));
                cell.setBackgroundColor(headerColor);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            for (SeatResponseDTO ticket : passenger.tickets()) {
                FlightDTO flight = null;

                if (summary.departingFlight() != null &&
                        ticket.flightId() == (summary.departingFlight().id())) {
                    flight = summary.departingFlight();
                } else if (summary.returningFlight() != null &&
                        ticket.flightId() == summary.returningFlight().id()) {
                    flight = summary.returningFlight();
                }

                if (flight != null) {

                    DateTimeFormatter formatter =
                            DateTimeFormatter.ofPattern("dd MMMM yyyy 'alle' HH:mm", Locale.ITALIAN);
                    // customizzazione data


                    table.addCell(flight.flightCode());
                    table.addCell(flight.companyName());
                    table.addCell(LocalDateTime.parse(flight.departureTime()).format(formatter));
                    table.addCell(LocalDateTime.parse(flight.arrivalTime()).format(formatter));
                    table.addCell(ticket.seat());
                    table.addCell(ticket.seatClass());
                }
            }

            document.add(table);
            document.add(Chunk.NEWLINE);

            // Footer
            Paragraph footer = new Paragraph("Grazie per aver scelto AeroZip!", sectionFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Errore nella generazione del PDF", e);
        }
    }
}
