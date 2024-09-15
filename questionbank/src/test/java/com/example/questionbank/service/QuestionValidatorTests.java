/**
 * This package contains test for the service layer of the Question Bank application.
 *
 * The service layer provides the business logic for managing {@link Question} entities.
 * It includes interfaces such as {@link QuestionServiceInterface} and their implementations
 * that interact with the repository layer to perform operations such as retrieving, adding,
 * updating, and deleting questions.
 */
package com.example.questionbank.service;

import com.example.questionbank.model.Question;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class QuestionValidatorTests {

    @Test
    void testValidQuestion() {
        Question question = new Question("Valid Title", "Valid Description", List.of("category1"), "easy");

        boolean result = QuestionValidator.isValidQuestion(question);

        assertThat(result).isTrue();
    }

    @Test
    void testInvalidQuestion() {
        Question question = new Question(null, "", List.of("category1"), "easy");

        boolean result = QuestionValidator.isValidQuestion(question);

        assertThat(result).isFalse();
    }
}
