package com.example.questionbank.commons;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for {@link QuestionWithTitleNotFoundException} in
 * the application.
 * <p>
 * This class handles exceptions of type {@link QuestionWithTitleNotFoundException}
 * thrown by controllers in the application and provides a response with a
 * 404 Not Found status.
 *
 */
@RestControllerAdvice
class QuestionWithTitleNotFoundAdvice {

    /**
     * Logger instance for logging exceptions and important information.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(
            QuestionWithTitleNotFoundAdvice.class
    );

    /**
     * Handles {@link QuestionWithTitleNotFoundException} and returns a 404 Not
     * Found response.
     * <p>
     * This method is triggered when a {@link QuestionWithTitleNotFoundException}
     * is thrown in the application. It logs the exception message and
     * returns it as the response body.
     *
     * @param ex the {@link QuestionWithTitleNotFoundException} that was thrown.
     * @return the exception message as the response body.
     */
    @ExceptionHandler(QuestionWithTitleNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String questionWithTitleNotFoundHandler(QuestionWithTitleNotFoundException ex) {
        LOGGER.error("Question with that title not found: {}", ex.getMessage());
        return ex.getMessage();
    }
}

