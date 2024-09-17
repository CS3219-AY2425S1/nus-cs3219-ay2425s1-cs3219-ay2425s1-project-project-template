package com.example.questionbank.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a question entity in the question bank.
 * <p>
 * This class is mapped to the "questionbank" collection in MongoDB.
 * It includes fields for the question's identifier, title, description,
 * categories, and complexity. Lombok annotations are used to generate
 * boilerplate code such as getters, setters, and constructors.
 * </p>
 */
@Data // Lombok generates getters, setters, equals, hashCode and toString
@NoArgsConstructor // Lombok generates a no-argument constructor
@AllArgsConstructor // Lombok generates a constructor with all fields
@Document(collection = "questionbank")
public class Question {

    /**
     * The unique identifier for the question in MongoDB.
     * <p>
     * This field is automatically assigned by MongoDB.
     * </p>
     */
    @Id
    private String id; // MongoDB idx

    /**
     * The title of the question.
     * <p>
     * This field holds a brief and descriptive title for the question.
     * </p>
     */
    private String title;

    /**
     * The description of the question.
     * <p>
     * This field provides a detailed explanation or context for
     * the question.
     * </p>
     */
    private String description;

    /**
     * The list of categories associated with the question.
     * <p>
     * This field helps in categorizing the question into different
     * topics or areas.
     * </p>
     */
    private List<String> categories;

    /**
     * The complexity level of the question.
     * <p>
     * This field indicates the difficulty of the question, such as
     * "easy", "medium", or "hard".
     * </p>
     */
    private String complexity;

    /**
     * The timestamp indicating when the question was created.
     * <p>
     * This field is indexed to allow sorting by creation date for better
     * order.
     * </p>
     */
    @Indexed
    private LocalDateTime createdAt;

    /**
     * Constructs a new {@code Question} with the specified title,
     * description, categories, and complexity.
     * <p>
     * This constructor is used when creating a new question without
     * specifying an ID.
     * </p>
     *
     * @param questionTitle       the title of the question
     * @param questionDesc the description of the question
     * @param questionCategories  the list of categories associated with
     *                            the question
     * @param questionComplexity  the complexity level of the question
     */
    public Question(final String questionTitle,
                    final String questionDesc,
                    final List<String> questionCategories,
                    final String questionComplexity) {
        this.title = questionTitle;
        this.description = questionDesc;
        this.categories = questionCategories;
        this.complexity = questionComplexity;
        this.createdAt = LocalDateTime.now();
    }

}
