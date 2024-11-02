package com.example.backend.websocketchat;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import com.example.backend.websocketchat.config.ChatUserPrincipal;
import com.example.backend.websocketchat.model.Message;

@Service
public class WebSocketChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;

    public WebSocketChatService(SimpMessagingTemplate messagingTemplate, SimpUserRegistry userRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.userRegistry = userRegistry;
    }

    public void sendToOtherUser(String topic, Message message, String senderUserID) {
        this.userRegistry.getUsers().forEach(user -> {
            String userID = ((ChatUserPrincipal) user.getPrincipal()).getName();
            if (!userID.equals(senderUserID)) {
                System.out.println("Sending message " + message.toString() + " to " + userID);
                System.out.println("Topic is " + topic);
                messagingTemplate.convertAndSendToUser(userID, topic, message.getMessage());
            }
        });
    }
}
