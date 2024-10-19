package com.example.backend.matching.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "matching")
public class MatchingModel {
    @Id
    private ObjectId id; 
    private String userEmail1;
    private String userEmail2;

    public MatchingModel() {
    }

    public MatchingModel(String userEmail1, String userEmail2) {
        this.userEmail1 = userEmail1;
        this.userEmail2 = userEmail2;
    }

    // Getters and Setters
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }


    public String getUserEmail1() {
        return userEmail1;
    }

    public void setUserEmail1(String userEmail1) {
        this.userEmail1 = userEmail1;
    }

    public String getUserEmail2() {
        return userEmail2;
    }

    public void setUserEmail2(String userEmail2) {
        this.userEmail2 = userEmail2;
    }

    // Override toString method
    @Override
    public String toString() {
        return "MatchingModel{" +
                "id='" + id + '\'' +
                ", userEmail1='" + userEmail1 + '\'' +
                ", userEmail2='" + userEmail2 + '\'' +
                '}';
    }
}
