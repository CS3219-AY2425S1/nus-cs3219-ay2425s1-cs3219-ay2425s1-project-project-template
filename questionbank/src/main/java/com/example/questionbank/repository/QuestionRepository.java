/**
 * This package contains the repository interfaces for the
 * Question Bank application.
 * <p>
 * The repositories handle the data access logic and interact
 * with the MongoDB database to perform CRUD operations on the
 * entities, such as {@link QuestionRepository} for managing
 * {@link Question} entities.
 */
package com.example.questionbank.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.questionbank.model.Question;

/**
 * Repository interface for managing {@link Question} entities
 * in MongoDB.
 * <p>
 * This interface extends {@link MongoRepository} to provide basic
 * CRUD operations and query capabilities for {@link Question} entities.
 * It includes a custom query method to find questions by their title.
 * </p>
 */
public interface QuestionRepository extends MongoRepository<Question, String> {

    // Example Spring Data Commons derived method for queries
    public Question findQuestionByTitle(String title);

}
