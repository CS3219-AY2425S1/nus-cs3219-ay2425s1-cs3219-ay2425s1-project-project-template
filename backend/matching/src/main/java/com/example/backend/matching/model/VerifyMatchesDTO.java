package com.example.backend.matching.model;

import lombok.Data;

@Data
public class VerifyMatchesDTO {
    String user1;
    String user2;
    String matchCriteriaDifficulty;
    String matchCriteriaTopic;

    public VerifyMatchesDTO(String user1, String user2, String matchCriteriaDifficulty, String matchCriteriaTopic) {
        this.user1 = user1;
        this.user2 = user2;
        this.matchCriteriaDifficulty = matchCriteriaDifficulty;
        this.matchCriteriaTopic = matchCriteriaTopic;
    }
}
