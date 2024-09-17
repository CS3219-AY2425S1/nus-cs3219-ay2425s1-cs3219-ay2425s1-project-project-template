/**
 * This package contains common classes and utilities for the Question
 * Bank application.
 * <p>
 * It includes custom exceptions such as {@link QuestionNotFoundException}
 * to handle error cases when a question is not found, as well as advice
 * classes like {@link QuestionNotFoundAdvice} that provide global
 * exception handling for REST controllers.
 * <p>
 * These classes ensure consistent error handling and reusable utilities
 * across the application.
 */
package com.example.questionbank.commons;

/**
 * Exception thrown when a question with a specific ID is not found.
 *
 * This exception is used to signal that a requested question could not
 * be found in the repository. It extends {@link RuntimeException} and
 * provides a specific message including the ID of the missing question.
 *
 */
public class QuestionNotFoundException extends RuntimeException {

    /**
     * Constructs a new {@link QuestionNotFoundException} with a detail
     * message including the specified ID.
     *
     * The message is constructed as "Could not find question " followed
     * by the given ID.
     *
     * @param id the ID of the question that could not be found.
     */
    public QuestionNotFoundException(String id) {
        super("Could not find question " + id);
    }
}
