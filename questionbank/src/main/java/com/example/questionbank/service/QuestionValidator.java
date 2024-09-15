package com.example.questionbank.service;

import com.example.questionbank.model.Question;

/**
 * Utility class for validating {@link Question} entities.
 * <p>
 * This class provides methods for validating the properties of questions, such as title or description length.
 * </p>
 */
public class QuestionValidator {

    public static boolean isValidQuestion(Question question) {
        // Example validation logic
        return question.getTitle() != null && !question.getTitle().isEmpty() &&
                question.getDescription() != null && !question.getDescription().isEmpty();
    }
}
