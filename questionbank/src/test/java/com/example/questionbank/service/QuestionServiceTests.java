/**
 * This package contains the tests for the service layer of the Question Bank application.
 *
 * The service layer provides the business logic for managing {@link Question} entities.
 * It includes interfaces such as {@link QuestionServiceInterface} and their implementations
 * that interact with the repository layer to perform operations such as retrieving, adding,
 * updating, and deleting questions.
 */
package com.example.questionbank.service;

import com.example.questionbank.model.Question;
import com.example.questionbank.repository.QuestionRepository;
import com.example.questionbank.commons.QuestionNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

public class QuestionServiceTests {

    @Mock
    private QuestionRepository repository;

    @InjectMocks
    private QuestionService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllQuestions() {
        // Given
        Question question = new Question("Sample Question", "Description", List.of("category1"), "easy");
        when(repository.findAll()).thenReturn(List.of(question));

        // When
        List<Question> result = service.getAllQuestions();

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getTitle()).isEqualTo("Sample Question");
    }

    @Test
    void testGetQuestionById() {
        // Given
        Question question = new Question("Sample Question", "Description", List.of("category1"), "easy");
        when(repository.findById(question.getId())).thenReturn(Optional.of(question));

        // When
        Question result = service.getQuestionById(question.getId());

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(question.getId());
    }

    @Test
    void testCreateQuestion() {
        // Given
        Question question = new Question("Sample Question", "Description", List.of("category1"), "easy");
        when(repository.save(question)).thenReturn(question);

        // When
        Question result = service.createQuestion(question);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Sample Question");
    }

    @Test
    void testUpdateQuestion() {
        // Given
        Question existingQuestion = new Question("Sample Question", "Description", List.of("category1"), "easy");
        Question updatedQuestion = new Question("New Title", "New Description", List.of("category1"), "medium");
        when(repository.findById("1")).thenReturn(Optional.of(existingQuestion));
        when(repository.save(updatedQuestion)).thenReturn(updatedQuestion);

        // When
        Question result = service.updateQuestion(existingQuestion.getId(), updatedQuestion);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("New Title");
    }

    @Test
    void testDeleteQuestion() {
        // Given
        when(repository.existsById("1")).thenReturn(true);

        // When
        service.deleteQuestion("1");

        // Then
        verify(repository, times(1)).deleteById("1");
    }

    @Test
    void testDeleteQuestionNotFound() {
        Question question = new Question("Sample Question", "Description", List.of("category1"), "easy");
        // Given
        when(repository.existsById(question.getId())).thenReturn(false);

        // When / Then
        assertThatThrownBy(() -> service.deleteQuestion(question.getId()))
                .isInstanceOf(QuestionNotFoundException.class)
                .hasMessage("Could not find question " + question.getId());
    }
}
