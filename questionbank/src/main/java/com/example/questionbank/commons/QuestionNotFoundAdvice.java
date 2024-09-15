package com.example.questionbank.commons;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for {@link QuestionNotFoundException} in the application.
 * <p>
 * This class handles exceptions of type {@link QuestionNotFoundException} thrown
 * by controllers in the application and provides a response with a 404 Not Found status.
 * </p>
 */
@RestControllerAdvice
class QuestionNotFoundAdvice {

    private static final Logger logger = LoggerFactory.getLogger(QuestionNotFoundAdvice.class);

    @ExceptionHandler(QuestionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String questionNotFoundHandler(QuestionNotFoundException ex) {
        logger.error("Question not found: {}", ex.getMessage());
        return ex.getMessage();
    }
}