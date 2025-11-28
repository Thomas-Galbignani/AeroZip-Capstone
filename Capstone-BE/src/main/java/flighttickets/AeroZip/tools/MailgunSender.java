package flighttickets.AeroZip.tools;


import kong.unirest.core.HttpResponse;
import kong.unirest.core.JsonNode;
import kong.unirest.core.MultipartBody;
import kong.unirest.core.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.util.List;

@Component
public class MailgunSender {
    private final String domain;
    private final String apiKey;

    public MailgunSender(@Value("${mailgun.domain}") String domain,
                         @Value("${mailgun.apiKey}") String apiKey) {
        this.domain = domain;
        this.apiKey = apiKey;
    }

    public void sendTicketEmail(String recipientEmail, byte[] pdfBytes) {
        try {
            ByteArrayInputStream pdfStream = new ByteArrayInputStream(pdfBytes);

            HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                    .basicAuth("api", this.apiKey)
                    .field("from", "AeroZip <postmaster@" + domain + ">")
                    .field("to", recipientEmail)
                    .field("subject", "Il tuo biglietto AeroZip")
                    .field("text", "Grazie per aver prenotato con AeroZip. In allegato trovi il tuo biglietto.")
                    .field("attachment", pdfStream, "biglietto.pdf")
                    .field("attachment", pdfStream, "biglietto2.pdf")
                    .asJson();

            System.out.println("Mailgun response: " + response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Errore nell'invio email con Mailgun", e);
        }
    }

    public void sendMultipleTicketEmail(String recipient, List<byte[]> pdfs) {
        try {
            MultipartBody request = Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                    .basicAuth("api", this.apiKey)
                    .field("from", "AeroZip <postmaster@" + domain + ">")
                    .field("to", recipient)
                    .field("subject", "I tuoi biglietti AeroZip")
                    .field("text", "In allegato trovi i biglietti per tutti i passeggeri.");

            int i = 1;
            for (byte[] pdf : pdfs) {
                request.field("attachment", new ByteArrayInputStream(pdf), "ticket" + i + ".pdf");
                i++;
            }

            HttpResponse<JsonNode> response = request.asJson();
            System.out.println("Mailgun status: " + response.getStatus());
            System.out.println("Mailgun response: " + response.getBody());
            if (!response.isSuccess()) {
                System.out.println("Mailgun error: " + response.getStatusText());
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore nell'invio email multipla", e);
        }
    }
}
