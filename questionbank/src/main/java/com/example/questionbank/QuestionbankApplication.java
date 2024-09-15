package com.example.questionbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Question Bank Spring Boot application.
 * <p>
 * This class contains the main method that launches the Spring Boot application. The {@link SpringBootApplication}
 * annotation is used to mark this class as a Spring Boot application and to enable auto-configuration, component
 * scanning, and configuration properties.
 * </p>
 */
@SpringBootApplication

public class QuestionbankApplication {
    public static void main(String... args) {
        SpringApplication.run(QuestionbankApplication.class, args);
    }

}
