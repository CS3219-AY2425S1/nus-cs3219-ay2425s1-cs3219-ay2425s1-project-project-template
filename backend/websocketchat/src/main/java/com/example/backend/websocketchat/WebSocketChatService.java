package com.example.backend.websocketchat;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import com.example.backend.websocketchat.model.Message;

@Service
public class WebSocketChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;

    public WebSocketChatService(SimpMessagingTemplate messagingTemplate, SimpUserRegistry userRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.userRegistry = userRegistry;
    }

}
