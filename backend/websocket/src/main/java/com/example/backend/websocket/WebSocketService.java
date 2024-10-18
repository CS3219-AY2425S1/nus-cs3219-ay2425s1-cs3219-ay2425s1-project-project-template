package com.example.backend.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;

    public WebSocketService(SimpMessagingTemplate messagingTemplate, SimpUserRegistry userRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.userRegistry = userRegistry;

    }

    public void notifyUser(String userId, String message) {
        if (userRegistry.getUser(userId) != null) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/matches", message);
        } else {
            System.out.println("User " + userId + " is not connected.");
        }    }
}
