/**
 * This package contains common classes and utilities for the Question Bank application.
 *
 * It includes custom exceptions such as {@link QuestionNotFoundException} to handle
 * error cases when a question is not found, as well as advice classes like {@link QuestionNotFoundAdvice}
 * that provide global exception handling for REST controllers.
 *
 * These classes ensure consistent error handling and reusable utilities across the application.
 */
package com.example.questionbank.commons;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for {@link QuestionNotFoundException} in the application.
 *
 * This class handles exceptions of type {@link QuestionNotFoundException} thrown
 * by controllers in the application and provides a response with a 404 Not Found status.
 *
 */
@RestControllerAdvice
class QuestionNotFoundAdvice {

    private static final Logger logger = LoggerFactory.getLogger(QuestionNotFoundAdvice.class);

    /**
     * Handles {@link QuestionNotFoundException} and returns a 404 Not Found response.
     *
     * This method is triggered when a {@link QuestionNotFoundException} is thrown in the application.
     * It logs the exception message and returns it as the response body.
     *
     * @param ex the {@link QuestionNotFoundException} that was thrown.
     * @return the exception message as the response body.
     */
    @ExceptionHandler(QuestionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String questionNotFoundHandler(QuestionNotFoundException ex) {
        logger.error("Question not found: {}", ex.getMessage());
        return ex.getMessage();
    }
}
