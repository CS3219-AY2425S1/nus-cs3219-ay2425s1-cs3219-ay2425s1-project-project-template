package com.example.backend.matching.kafka;

import java.util.HashMap;
import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.example.backend.matching.websocket.WebSocketService;

@Component
public class MatchRequestConsumer {

    private final Map<String, String> waitingRequests = new HashMap<>();
    private final WebSocketService webSocketService;

    public MatchRequestConsumer(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @KafkaListener(topics = "MATCH_REQUESTS", groupId = "matching-service")
    public void listen(String message) {
        String key = extractKey(message);  // Extract matching criteria from message
        System.out.println("Received message: " + message);

        if (waitingRequests.containsKey(key)) {
            // Match found
            System.out.println("Match found for key: " + key);
            String otherUser = waitingRequests.remove(key);
            handleMatch(message, otherUser);
        } else {
            // No match found, add to waiting list
            System.out.println("No match found for key: " + key);
            waitingRequests.put(key, message);
        }
    }

    private String extractKey(String message) {
        return message.split("_")[0] + "_" + message.split("_")[1];
    }

    private void handleMatch(String user1, String user2) {
        System.out.println("Notifying users about match");
        webSocketService.notifyUser(user1, "Matched with: " + user2);
        webSocketService.notifyUser(user2, "Matched with: " + user1);
    }
}
