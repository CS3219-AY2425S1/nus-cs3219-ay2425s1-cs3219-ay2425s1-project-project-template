/**
 * The base package for the Question Bank application.
 * <p>
 * This package contains the entry point for the Spring Boot application
 * and common configurations and utilities for the entire project.
 */
package com.example.questionbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Question Bank Spring Boot application.
 * <p>
 * This class contains the main method that launches the Spring Boot
 * application. The {@link SpringBootApplication} annotation is used
 * to mark this class as a Spring Boot application and to enable
 * autoconfiguration, component scanning, and configuration properties.
 *
 */
@SpringBootApplication

public class QuestionbankApplication {

    /**
     * The main method that serves as the entry point to the
     * Spring Boot application.
     *
     * @param args command-line arguments passed to the application.
     */
    public static void main(String... args) {
        SpringApplication.run(QuestionbankApplication.class, args);
    }

}
