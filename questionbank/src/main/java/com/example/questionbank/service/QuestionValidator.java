/**
 * This package contains the service layer of the Question
 * Bank application.
 * <p>
 * The service layer provides the business logic for managing
 * {@link Question} entities. It includes interfaces such as
 * {@link QuestionServiceInterface} and their implementations
 * that interact with the repository layer to perform operations
 * such as retrieving, adding, updating, and deleting questions.
 */
package com.example.questionbank.service;

import com.example.questionbank.model.Question;

/**
 * Utility class for validating {@link Question} entities.
 * <p>
 * This class provides methods for validating the properties
 * of questions, such as title or description length.
 *
 */
public class QuestionValidator {

    /**
     * Validates a {@link Question} entity.
     *
     * This method checks whether the {@code title} and
     * {@code description} of the provided {@link Question} are non-null
     * and non-empty. It returns {@code true} if both fields are valid,
     * otherwise it returns {@code false}.
     *
     * @param question the {@link Question} entity to be validated.
     * @return {@code true} if the {@link Question} is valid,
     * {@code false} otherwise.
     */
    public static boolean isValidQuestion(Question question) {
        // Example validation logic
        return question.getTitle() != null &&
                !question.getTitle().isEmpty() &&
                question.getDescription() != null &&
                !question.getDescription().isEmpty();
    }
}
