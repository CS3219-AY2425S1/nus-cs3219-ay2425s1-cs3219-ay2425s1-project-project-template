package com.example.backend.matching.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class MatchingWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
	public MatchingWebSocketController(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

    @MessageMapping("/matchRequest")
    public void processMatchRequest(MatchRequest matchRequest, Principal principal) throws Exception {
        String user = principal.getName();
        System.out.println("Processing match request for user: " + user);
    }
}

// use this to send message to specific user once match is found
// messagingTemplate.convertAndSendToUser(user, "/queue/matches", matchRequest);