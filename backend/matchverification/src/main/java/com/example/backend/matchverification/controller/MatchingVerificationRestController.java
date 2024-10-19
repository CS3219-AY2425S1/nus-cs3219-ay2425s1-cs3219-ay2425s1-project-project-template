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
    private final MatchVerificationHashsetService invalidMatchesHashset;

    private enum VerificationStatus {
        SUCCESS,
        CONFLICT_PARTIAL_INVALID,
        CONFLICT_BOTH_INVALID
    }

    @Autowired
    public MatchingVerificationRestController(MatchVerificationProducer matchVerificationProducer,
                                              MatchVerificationHashsetService matchRequestService) {
        this.matchVerificationProducer = matchVerificationProducer;
        this.invalidMatchesHashset = matchRequestService;
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
        String wsID1 = matchReq1.split("_")[0];
        String wsID2 = matchReq2.split("_")[0];

        System.out.println("Verifying match requests: " + matchReq1 + " and " + matchReq2);

        boolean match1IsInvalid = invalidMatchesHashset.isSeen(wsID1);
        boolean match2IsInvalid = invalidMatchesHashset.isSeen(wsID2);
        System.out.println("Match1 status: " + !match1IsInvalid + " Match2 status: " + !match2IsInvalid);

        List<String> validMatches = new ArrayList<>();
        List<String> invalidMatches = new ArrayList<>();

        if (match1IsInvalid) {
            invalidMatches.add(matchReq1);
        } else {
            validMatches.add(matchReq1);
        }

        if (match2IsInvalid) {
            invalidMatches.add(matchReq2);
        } else {
            validMatches.add(matchReq2);
        }

        String status = VerificationStatus.SUCCESS.toString();
        String message;
        if (validMatches.size() == 1 && invalidMatches.size() == 1) {
            System.out.println("PARTIAL INVALID MATCH");
            message = "One or more of the match requests are invalid.";
            status = VerificationStatus.CONFLICT_PARTIAL_INVALID.toString();
        } else if (invalidMatches.size() == 2) {
            System.out.println("BOTH INVALID MATCH");
            message = "Both match requests are invalid.";
            status = VerificationStatus.CONFLICT_BOTH_INVALID.toString();
        } else {
            System.out.println("VALID MATCH");
            message = "Both match requests are new and valid.";
        }

        if (validMatches.size() == 2 && invalidMatches.isEmpty() && status.equals(VerificationStatus.SUCCESS.toString())) {
            System.out.println(validMatches);
            String payload = validMatches.get(0) + "_" + validMatches.get(1);
            invalidMatchesHashset.addToSeenRequests(wsID1); // Add wsid
            invalidMatchesHashset.addToSeenRequests(wsID2); // Add wsid
            for (String match : validMatches) {
                System.out.println(match);
                String userID = match.split("_")[0];
                matchVerificationProducer.sendMessage("SUCCESSFUL_MATCHES", userID, payload);
            }
        }


        return new VerificationResponse(
            status,
            message,
            validMatches,
            invalidMatches
        );
    }
}
