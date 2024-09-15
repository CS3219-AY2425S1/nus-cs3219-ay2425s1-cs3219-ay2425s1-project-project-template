package com.example.questionbank.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.questionbank.model.Question;

public interface QuestionRepository extends MongoRepository<Question, String> {
    public Question findQuestionByTitle(String title); // Example Spring Data Commons derived method for queries
}