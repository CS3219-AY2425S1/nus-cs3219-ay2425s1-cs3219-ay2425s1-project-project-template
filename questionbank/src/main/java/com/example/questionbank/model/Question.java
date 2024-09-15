package com.example.questionbank.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Data // Lombok generates getters, setters, equals, hashCode and toString
@NoArgsConstructor // Lombok generates a no-argument constructor
@AllArgsConstructor // Lombok generates a constructor with all fields
@Document
public class Question {

    @Id
    private String id; // MongoDB id

    @Indexed(unique = true)
    private Long questionId; // Numeric question ID, unique and indexed

    @Indexed(unique=true)
    private String title;

    private String description;

    private List<String> categories;

    private String complexity;

    // Constructor without MongoDB Vid field
    public Question(String title, String description, List<String> categories, String complexity) {

        this.title = title;
        this.description = description;
        this.categories = categories;
        this.complexity = complexity;
    }

}
