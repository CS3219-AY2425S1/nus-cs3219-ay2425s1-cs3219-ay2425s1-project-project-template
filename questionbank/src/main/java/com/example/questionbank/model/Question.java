package com.example.questionbank.model;

import java.time.LocalDate;
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
 * This class is mapped to the "questionbank" collection in MongoDB. It includes fields for the question's
 * identifier, title, description, categories, and complexity. Lombok annotations are used to generate
 * boilerplate code such as getters, setters, and constructors.
 * </p>
 */
@Data // Lombok generates getters, setters, equals, hashCode and toString
@NoArgsConstructor // Lombok generates a no-argument constructor
@AllArgsConstructor // Lombok generates a constructor with all fields
@Document(collection = "questionbank")
public class Question {

    @Id
    private String id; // MongoDB idx
    private String title;
    private String description;
    private List<String> categories;
    private String complexity;

    @Indexed
    private LocalDateTime createdAt; // Allow sorting by createdAt for better order

    /**
     * Constructs a new {@code Question} with the specified title, description, categories, and complexity.
     * <p>
     * This constructor is used when creating a new question without specifying an ID.
     * </p>
     *
     * @param title       the title of the question
     * @param description the description of the question
     * @param categories  the list of categories associated with the question
     * @param complexity  the complexity level of the question
     */
    public Question(String title, String description, List<String> categories, String complexity) {

        this.title = title;
        this.description = description;
        this.categories = categories;
        this.complexity = complexity;
        this.createdAt = LocalDateTime.now();
    }

}
