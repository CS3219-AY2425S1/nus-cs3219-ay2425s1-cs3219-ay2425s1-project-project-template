package com.example.backend.matchverification.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.matchverification.kafka.producers.MatchVerificationProducer;
import com.example.backend.matchverification.model.VerificationResponse;

@RestController
@RequestMapping("/api")
public class MatchingVerificationRestController {

    private final MatchVerificationProducer matchVerificationProducer;
    private final MatchVerificationHashsetService matchVerificationHashset;

    @Autowired
    public MatchingVerificationRestController(MatchVerificationProducer matchVerificationProducer,
                                              MatchVerificationHashsetService matchRequestService) {
        this.matchVerificationProducer = matchVerificationProducer;
        this.matchVerificationHashset = matchRequestService;
    }

    @GetMapping("")
    public String greeting() {
        return "Hello from matching verification service!";
    }

    @PostMapping("/verify")
    public VerificationResponse verify(@RequestBody List<String> userMatches) {
        if (userMatches.size() != 2) {
            return new VerificationResponse(
                "Error", 
                "Invalid input, must provide exactly two match requests.", 
                new ArrayList<>(), 
                new ArrayList<>()
            );
        }

        String matchReq1 = userMatches.get(0);
        String matchReq2 = userMatches.get(1);

        boolean match1Exists = matchVerificationHashset.isSeen(matchReq1);
        boolean match2Exists = matchVerificationHashset.isSeen(matchReq2);

        List<String> seenMatches = new ArrayList<>();
        List<String> unseenMatches = new ArrayList<>();

        if (match1Exists) {
            seenMatches.add(matchReq1);
        } else {
            unseenMatches.add(matchReq1);
        }

        if (match2Exists) {
            seenMatches.add(matchReq2);
        } else {
            unseenMatches.add(matchReq2);
        }

        String status = "Success";
        String message;
        if (!seenMatches.isEmpty() && !unseenMatches.isEmpty()) {
            message = "One or more of the match requests have been seen before.";
            status = "Conflict_Partial_Seen";
        } else if (!seenMatches.isEmpty()) {
            message = "Both match requests have been seen before.";
            status = "Conflict_Both_Seen";
        } else {
            message = "Both match requests are new and unseen.";
        }

        if (unseenMatches.size() == 2) {
            String payload = unseenMatches.get(0) + "_" + unseenMatches.get(1);
            matchVerificationHashset.addToSeenRequests(matchReq1);
            matchVerificationHashset.addToSeenRequests(matchReq2);
            for (String match : unseenMatches) {
                String userID = match.split("_")[0];
                matchVerificationProducer.sendMessage("SUCCESSFUL_MATCHES", userID, payload);
            }
        }


        return new VerificationResponse(
            status,
            message,
            seenMatches,
            unseenMatches
        );
    }
}
