package com.example.backend.websocketchat.model;

import lombok.Data;

@Data
public class Message {
    private String message;
    private String collabID;

    public Message(String message, String collabID) {
        this.message = message;
        this.collabID = collabID;
    }
}
