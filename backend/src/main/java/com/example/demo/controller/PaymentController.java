package com.example.demo.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    public PaymentController(@Value("${STRIPE_SECRET_KEY}") String secretKey) {
        Stripe.apiKey = secretKey;
    }

    @PostMapping("/create-payment-intent")
    public Map<String, Object> createPaymentIntent(@RequestBody Map<String, Object> data) throws StripeException {
        int amount = (int) data.getOrDefault("amount", 0); // amount in cents
        String currency = (String) data.getOrDefault("currency", "usd");

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setAmount((long) amount)
    .setCurrency(currency)
    .addPaymentMethodType("card")
    .build();
        PaymentIntent intent = PaymentIntent.create(params);

        Map<String, Object> response = new HashMap<>();
        response.put("clientSecret", intent.getClientSecret());
        return response;
    }
}
