/**
 * This package contains the repository interfaces for the Question Bank application.
 *
 * The repositories handle the data access logic and interact with the MongoDB database
 * to perform CRUD operations on the entities, such as {@link QuestionRepository}
 * for managing {@link Question} entities.
 */
package com.example.questionbank.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.example.questionbank.model.Question;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.List;

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
                Resource resource = new ClassPathResource("initialQuestions.json");
                ObjectMapper objectMapper = new ObjectMapper();

                try {
                    List<Question> questions = objectMapper.readValue(resource.getInputStream(),
                            new TypeReference<List<Question>>(){});
                    for (Question question : questions) {
                        log.info("Preloading " + repository.save(question));
                    }
                } catch (IOException e) {
                    log.error("Failed to load initial data", e);
                }
            } else {
                log.info("Database already initialized, skipping preloading.");
            }
        };
    }
}


