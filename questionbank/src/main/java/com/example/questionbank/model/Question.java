package com.example.questionbank.model;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Entity
@Data // Lombok generates getters, setters, equals, hashCode and toString
@NoArgsConstructor // Lombok generates a no-argument constructor
@AllArgsConstructor // Lombok generates a constructor with all fields
public class Question {

    private @Id
    @GeneratedValue Long id;
    private String title;

    @Column(length = 1000) // Adjust length to fit description needs
    private String description;

    @ElementCollection // Indicates that this is a collection of basic types
    private List<String> categories; // A list of categories

    private String complexity;

    // Constructor without id field
    public Question(String title, String description, List<String> categories, String complexity) {

        this.title = title;
        this.description = description;
        this.categories = categories;
        this.complexity = complexity;
    }

}
