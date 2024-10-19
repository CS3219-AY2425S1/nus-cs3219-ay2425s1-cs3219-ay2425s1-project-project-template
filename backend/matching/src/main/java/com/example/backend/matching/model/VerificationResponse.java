package com.example.backend.matching.model;

import java.util.List;

public class VerificationResponse {
    private String status;
    private String message;
    private List<String> seenMatches;
    private List<String> unseenMatches;

    public VerificationResponse(String status, String message, List<String> seenMatches, List<String> unseenMatches) {
        this.status = status;
        this.message = message;
        this.seenMatches = seenMatches;
        this.unseenMatches = unseenMatches;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getSeenMatches() {
        return seenMatches;
    }

    public void setSeenMatches(List<String> seenMatches) {
        this.seenMatches = seenMatches;
    }

    public List<String> getUnseenMatches() {
        return unseenMatches;
    }

    public void setUnseenMatches(List<String> unseenMatches) {
        this.unseenMatches = unseenMatches;
    } 
}
