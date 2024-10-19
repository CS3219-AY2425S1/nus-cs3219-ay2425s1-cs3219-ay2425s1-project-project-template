package com.example.backend.websocket.kafka.consumers;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.example.backend.websocket.WebSocketService;

@Component
public class MatchRequestConsumer {
    private final WebSocketService webSocketService;

    public MatchRequestConsumer(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @KafkaListener(topics = "SUCCESSFUL_MATCHES")
    public void listen(@Header(KafkaHeaders.RECEIVED_KEY) String key, String value) {
        System.out.println("Received successful match: " + value);
        System.out.println("Informing user" + key + " about the match");
        String[] userInformation = value.split("_");
        String user1Id = userInformation[0];
        String user1Email = userInformation[1];
        String user2Id = userInformation[2];
        String user2Email = userInformation[3];
        if (key.equals(user1Id)) {
            webSocketService.notifyUser(user1Id, "Matched with: " + user2Email);
        } else if (key.equals(user2Id))         {
            webSocketService.notifyUser(user2Id, "Matched with: " + user1Email);
        }
    }
}