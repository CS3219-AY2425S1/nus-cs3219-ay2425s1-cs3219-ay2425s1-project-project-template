package com.example.backend.matching.model;

public class MatchRequest {
    private String userId;
    private String programmingLanguage;
    private String difficulty;
    private String topics;

    // Getters and setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getProgrammingLanguage() { return programmingLanguage; }
    public void setProgrammingLanguage(String programmingLanguage) { this.programmingLanguage = programmingLanguage; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTopics() { return topics; }
    public void setTopics(String topics) { this.topics = topics; }
}
