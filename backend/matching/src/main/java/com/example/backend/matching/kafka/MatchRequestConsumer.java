package com.example.backend.matching.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class MatchRequestConsumer {

    @KafkaListener(topics = "MATCH_REQUESTS", groupId = "matching-service")
    public void listen(String message) {
        System.out.println("===============================================Received message: ");
    }

}