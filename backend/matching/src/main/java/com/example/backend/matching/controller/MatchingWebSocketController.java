package com.example.backend.matching.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.backend.matching.kafka.MatchRequestProducer;

@Controller
public class MatchingWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MatchRequestProducer matchRequestProducer;

    @Autowired
	public MatchingWebSocketController(SimpMessagingTemplate messagingTemplate, MatchRequestProducer matchRequestProducer) {
		this.messagingTemplate = messagingTemplate;
        this.matchRequestProducer = matchRequestProducer;
	}

    @MessageMapping("/matchRequest")
    public void processMatchRequest(MatchRequest matchRequest, Principal principal) throws Exception {
        String user = principal.getName();
        System.out.println("Processing match request for user: " + user);
        matchRequestProducer.sendMessage("MATCH_REQUESTS", "key1", "value1");
    }

}

// use this to send message to specific user once match is found
// messagingTemplate.convertAndSendToUser(user, "/queue/matches", matchRequest);