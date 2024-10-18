package com.example.backend.websocket.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.example.backend.websocket.kafka.producers.MatchRequestProducer;

@Controller
public class WebSocketController {

    private MatchRequestProducer matchRequestProducer;

    public WebSocketController(MatchRequestProducer matchRequestProducer) {
        this.matchRequestProducer = matchRequestProducer;
    }

    @MessageMapping("/matchRequest")
    public void processMatchRequest(MatchRequest matchRequest, Principal principal) {
        String userId = principal.getName(); // This should return the user's UUID
        System.out.println("Received match request from user: " + matchRequest.getUserEmail());
        matchRequestProducer.sendMessage("MATCH_REQUESTS", matchRequest.getMatchCriteriaKey(), userId + "_" + matchRequest.getUserEmail());
    }
}