package com.example.backend.websocket.model;

public class MatchNotification {
    private String matchedUserEmail;

    public MatchNotification(String matchedUserEmail) {
        this.matchedUserEmail = matchedUserEmail;
    }

    public String getMatchedUserEmail() {
        return matchedUserEmail;
    }

    public void setMatchedUserEmail(String matchedUserEmail) {
        this.matchedUserEmail = matchedUserEmail;
    }
}
