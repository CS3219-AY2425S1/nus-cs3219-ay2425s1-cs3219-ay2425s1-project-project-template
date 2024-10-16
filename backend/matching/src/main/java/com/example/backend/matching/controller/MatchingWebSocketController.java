package com.example.backend.matching.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.example.backend.matching.kafka.MatchRequestProducer;

@Controller
public class MatchingWebSocketController {

    private final MatchRequestProducer matchRequestProducer;

    @Autowired
    public MatchingWebSocketController(MatchRequestProducer matchRequestProducer) {
        this.matchRequestProducer = matchRequestProducer;
    }

    @MessageMapping("/matchRequest")
    public void processMatchRequest(MatchRequest matchRequest, Principal principal) {
        String userId = principal.getName(); // This should return the user's ID
        System.out.println("Received match request from user: " + userId);
        matchRequestProducer.sendMessage("MATCH_REQUESTS", userId, matchRequest.toString());
    }
}


// use this to send message to specific user once match is found
// messagingTemplate.convertAndSendToUser(user, "/queue/matches", matchRequest);