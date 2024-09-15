/**
 * This package contains the repository interfaces for the Question Bank application.
 *
 * The repositories handle the data access logic and interact with the MongoDB database
 * to perform CRUD operations on the entities, such as {@link QuestionRepository}
 * for managing {@link Question} entities.
 */
package com.example.questionbank.repository;

import com.example.questionbank.model.Question;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;

import java.util.Arrays;

/**
 * Configuration class for preloading the database with sample {@link Question} data.
 *
 * This class uses a {@link CommandLineRunner} bean to populate the MongoDB database
 * with predefined questions when the application starts. It ensures that the questions
 * are only loaded if the database is empty.The class logs the preloading actions to
 * provide visibility into the initialization process.
 * 
 */
@Configuration
public class LoadDatabase {

    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

    @Bean
    CommandLineRunner initDatabase(QuestionRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                log.info("Preloading " + repository.save(new Question("Reverse a String",
                        "Write a function that reverses a string. "
                                + "The input string is given as an array of characters s. \n"
                                + "\n"
                                + "You must do this by modifying the input array in-place with O(1) extra memory. \n"
                                + "\n"
                                + "Example 1:\n"
                                + "\n"
                                + "Input: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\n"
                                + "Output: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n"
                                + "\n"
                                + "Example 2:\n"
                                + "Input: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\n"
                                + "Output: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n"
                                + "\n"
                                + "Constraints:\n"
                                + "\n"
                                + "1 <= s.length <= 105\n"
                                + "s[i] is a printable ascii character.\n",
                        Arrays.asList("Strings", "Algorithms"),
                        "Easy")));
                log.info("Preloading " + repository.save(new Question("Linked List Cycle Detection",
                        "Implement a function to detect if a linked list contains a cycle.",
                        Arrays.asList("Data Structures", "Algorithms"),
                        "Easy")));
            } else {
                log.info("Database already initialized, skipping preloading.");
            }
        };
    }
}
