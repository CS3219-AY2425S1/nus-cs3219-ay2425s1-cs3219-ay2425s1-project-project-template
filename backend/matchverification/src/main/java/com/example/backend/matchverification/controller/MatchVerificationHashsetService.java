package com.example.backend.matchverification.controller;

import java.util.HashSet;

import org.springframework.stereotype.Service;

@Service
public class MatchVerificationHashsetService {
    private final HashSet<String> seenMatchRequests = new HashSet<>();

    public boolean addToSeenRequests(String matchRequest) {
        return seenMatchRequests.add(matchRequest);
    }

    public boolean isSeen(String matchRequest) {
        return seenMatchRequests.contains(matchRequest);
    }

    public HashSet<String> getSeenMatchRequests() {
        return seenMatchRequests;
    }
}
