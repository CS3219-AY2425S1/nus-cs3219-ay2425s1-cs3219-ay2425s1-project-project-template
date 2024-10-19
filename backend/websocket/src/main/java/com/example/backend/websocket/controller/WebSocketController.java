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
        String userId = principal.getName(); // This should return the wsid
        System.out.println("Received match request from user: " + matchRequest.getUserEmail());
        matchRequest.getMatchCriteriaKey().forEach(key -> {
            matchRequestProducer.sendMessage("MATCH_REQUESTS", key, userId + "_" + matchRequest.getUserEmail());
        });
    }
}