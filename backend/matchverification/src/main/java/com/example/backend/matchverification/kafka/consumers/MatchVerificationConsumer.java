package com.example.backend.matchverification.kafka.consumers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.example.backend.matchverification.controller.MatchVerificationHashsetService;

@Component
public class MatchVerificationConsumer {

    private final MatchVerificationHashsetService matchVerificationHashset;

    @Autowired
    public MatchVerificationConsumer(MatchVerificationHashsetService matchVerificationHashsetService) {
        this.matchVerificationHashset = matchVerificationHashsetService;
    }

    @KafkaListener(topics = "DISCONNECTS")
    public void listen(@Header(KafkaHeaders.RECEIVED_KEY) String key, String value) {
        System.out.println("Disconnect received: " + value);
        this.matchVerificationHashset.addToSeenRequests(value);
    }
}