package com.example.backend.matching.controller;

import lombok.Data;

@Data
public class MatchRequest {
    private String userEmail;
    private String topic;
    private String language;
    private String difficulty;
}
