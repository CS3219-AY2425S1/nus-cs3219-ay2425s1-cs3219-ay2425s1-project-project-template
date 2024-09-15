package com.example.questionbank.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.questionbank.model.Question;

/**
 * Repository interface for managing {@link Question} entities in MongoDB.
 * <p>
 * This interface extends {@link MongoRepository} to provide basic CRUD operations and query capabilities
 * for {@link Question} entities. It includes a custom query method to find questions by their title.
 * </p>
 */
public interface QuestionRepository extends MongoRepository<Question, String> {
    public Question findQuestionByTitle(String title); // Example Spring Data Commons derived method for queries

}