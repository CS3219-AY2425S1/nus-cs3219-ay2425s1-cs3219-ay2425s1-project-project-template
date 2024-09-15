package com.example.questionbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.questionbank.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {

}