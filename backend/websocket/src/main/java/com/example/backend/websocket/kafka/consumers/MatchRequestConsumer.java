package com.example.backend.websocket.kafka.consumers;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.example.backend.websocket.WebSocketService;

@Component
public class MatchRequestConsumer {
    private final WebSocketService webSocketService;

    public MatchRequestConsumer(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @KafkaListener(topics = "SUCCESSFUL_MATCHES")
    public void listen(String value) {
        String[] userInformation = value.split("_");
        String user1Id = userInformation[0];
        String user1Email = userInformation[1];
        String user2Id = userInformation[2];
        String user2Email = userInformation[3];
        webSocketService.notifyUser(user1Id, "Matched with: " + user2Email);
        webSocketService.notifyUser(user2Id, "Matched with: " + user1Email);
    }
}