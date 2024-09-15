package com.example.questionbank.commons;

/**
 * Exception thrown when a question with a specific ID is not found.
 * <p>
 * This exception is used to signal that a requested question could not be found in the repository.
 * It extends {@link RuntimeException} and provides a specific message including the ID of the missing question.
 * </p>
 */
public class QuestionNotFoundException extends RuntimeException {

    public QuestionNotFoundException(String id) {
        super("Could not find question " + id);
    }
}