package flighttickets.AeroZip.controllers;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = "*")
public class StripeController {

    @Value("${STRIPE_SECRET_KEY}")
    private String stripeSecretKey;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @RequestBody CheckoutRequest request) {

        Stripe.apiKey = stripeSecretKey;

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(request.getSuccessUrl() + "&session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(request.getCancelUrl())
                    .setCustomerEmail(request.getCustomerEmail())
                    .setClientReferenceId(String.valueOf(request.getReservationId()))
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("eur")
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Prenotazione Viaggio")
                                                                    .setDescription("Prenotazione #" + request.getReservationId())
                                                                    .build()
                                                    )
                                                    .setUnitAmount((long) (request.getAmount() * 100))
                                                    .build()
                                    )
                                    .setQuantity(1L).build()
                    )
                    .build();

            Session session = Session.create(params);

            Map<String, String> response = new HashMap<>();
            response.put("sessionId", session.getId());
            response.put("url", session.getUrl());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Data
    public static class CheckoutRequest {
        private UUID reservationId;
        private Double amount;
        private String customerEmail;
        private String successUrl;
        private String cancelUrl;
    }
}
