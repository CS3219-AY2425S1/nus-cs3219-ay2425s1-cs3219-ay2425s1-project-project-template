package com.example.backend.matching.kafka;

import java.util.HashMap;
import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class MatchRequestConsumer {

    private final Map<String, String> waitingRequests = new HashMap<>();

    @KafkaListener(topics = "MATCH_REQUESTS", groupId = "matching-service")
    public void listen(@Header(KafkaHeaders.RECEIVED_KEY) String key, String value) {
        System.out.println("Received message, key: " + key + " value: " + value);

        if (waitingRequests.containsKey(key)) {
            // Match found
            System.out.println("Match found for key: " + key);
            String otherUserValue = waitingRequests.remove(key);
        } else {
            // No match found, add to waiting list
            System.out.println("No match found for key: " + key);
            waitingRequests.put(key, value);
        }
    }
}
