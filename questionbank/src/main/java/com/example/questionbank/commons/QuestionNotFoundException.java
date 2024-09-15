package com.example.questionbank.commons;

public class QuestionNotFoundException extends RuntimeException {

    public QuestionNotFoundException(String id) {
        super("Could not find question " + id);
    }
}