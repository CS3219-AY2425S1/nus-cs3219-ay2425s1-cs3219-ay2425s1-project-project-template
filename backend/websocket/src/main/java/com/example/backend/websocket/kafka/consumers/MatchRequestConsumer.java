package com.example.backend.websocket.kafka.consumers;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.example.backend.websocket.WebSocketService;
import com.example.backend.websocket.model.MatchNotification;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MatchRequestConsumer {
    private final WebSocketService webSocketService;
    private final ObjectMapper objectMapper;

    public MatchRequestConsumer(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
        this.objectMapper = new ObjectMapper(); 
    }

    @KafkaListener(topics = "SUCCESSFUL_MATCHES")
    public void listen(@Header(KafkaHeaders.RECEIVED_KEY) String key, String value) {
        System.out.println("Received successful match: " + value);
        System.out.println("Informing user " + key + " about the match");
        
        String[] userInformation = value.split("_");
        String user1Id = userInformation[0];
        String user1Email = userInformation[1];
        String user2Id = userInformation[2];
        String user2Email = userInformation[3];
        
        MatchNotification notification;

        if (key.equals(user1Id)) {
            notification = new MatchNotification(user2Email);
        } else if (key.equals(user2Id)) {
            notification = new MatchNotification(user1Email);
        } else {
            System.out.println("Unexpected key: " + key);
            return;
        }

        try {
            String jsonNotification = objectMapper.writeValueAsString(notification);
            webSocketService.notifyUser(key, jsonNotification);
        } catch (JsonProcessingException e) {
            System.err.println("Error converting notification to JSON: " + e.getMessage());
        }
    }
}
