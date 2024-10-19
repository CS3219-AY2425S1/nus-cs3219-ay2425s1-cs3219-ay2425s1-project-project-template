package com.example.backend.matchverification.model;

import java.util.List;

public class VerificationResponse {
    private String status;
    private String message;
    private List<String> validMatches;
    private List<String> invalidMatches;

    public VerificationResponse(String status, String message, List<String> validMatches, List<String> invalidMatches) {
        this.status = status;
        this.message = message;
        this.validMatches = validMatches;
        this.invalidMatches = invalidMatches;
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

    public List<String> getValidMatches() {
        return validMatches;
    }

    public void setValidMatches(List<String> validMatches) {
        this.validMatches = validMatches;
    }

    public List<String> getInvalidMatches() {
        return invalidMatches;
    }

    public void setInvalidMatches(List<String> invalidMatches) {
        this.invalidMatches = invalidMatches;
    } 
}
