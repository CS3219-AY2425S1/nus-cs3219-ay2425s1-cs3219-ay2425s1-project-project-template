/**
 * This package contains the tests for the repository interfaces for the Question Bank application.
 *
 * The repositories handle the data access logic and interact with the MongoDB database
 * to perform CRUD operations on the entities, such as {@link QuestionRepository}
 * for managing {@link Question} entities.
 */
package com.example.questionbank.repository;

import com.example.questionbank.model.Question;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
@ActiveProfiles("test")
public class QuestionRepositoryTests {

    @Autowired
    private QuestionRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void testFindQuestionByTitle() {
        // Given
        Question question = new Question("Sample Question", "This is a sample description", List.of("category1"), "easy");
        repository.save(question);

        // When
        Question found = repository.findQuestionByTitle("Sample Question");

        // Then
        assertThat(found).isNotNull();
        System.out.println(found);
        //assertThat(found.getTitle()).isEqualTo("Sample Question");
    }
}

