package com.example.backend.websocket.model;

import lombok.Data;

@Data
public class MatchNotification {
    private String matchedUserEmail;
    private String collaborationId;
    private String questionId;

    public MatchNotification(String matchedUserEmail, String collaborationId, String questionId) {
        this.matchedUserEmail = matchedUserEmail;
        this.collaborationId = collaborationId;
        this.questionId = questionId;
    }
}
