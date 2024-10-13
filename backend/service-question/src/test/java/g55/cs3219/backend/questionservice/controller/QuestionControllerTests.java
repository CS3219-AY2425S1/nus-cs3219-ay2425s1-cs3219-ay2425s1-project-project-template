package g55.cs3219.backend.questionservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import g55.cs3219.backend.questionservice.dto.QuestionDto;
import g55.cs3219.backend.questionservice.exception.QuestionNotFoundException;
import g55.cs3219.backend.questionservice.service.QuestionService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser; // Import for @WithMockUser
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf; // Import for csrf()
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuestionController.class)
@WithMockUser(username = "testuser", roles = {"USER"})
class QuestionControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllQuestions_ReturnsQuestions() throws Exception {
        QuestionDto question1 = new QuestionDto();
        question1.setId(1);
        question1.setTitle("Question 1");
        QuestionDto question2 = new QuestionDto();
        question2.setId(2);
        question2.setTitle("Question 2");
        List<QuestionDto> questions = Arrays.asList(question1, question2);

        when(questionService.getAllQuestions()).thenReturn(questions);

        mockMvc.perform(get("/api/question/questions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Question 1"))
                .andExpect(jsonPath("$[1].title").value("Question 2"));
    }

    @Test
    void getQuestionById_ExistingId_ReturnsQuestion() throws Exception {
        QuestionDto question = new QuestionDto();
        question.setId(1);
        question.setTitle("Question 1");

        when(questionService.getQuestionById(1)).thenReturn(question);

        mockMvc.perform(get("/api/question/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Question 1"));
    }

    @Test
    void getQuestionById_NonExistingId_ReturnsNotFound() throws Exception {
        when(questionService.getQuestionById(99)).thenThrow(new QuestionNotFoundException("Question not found"));

        mockMvc.perform(get("/api/question/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Question not found"));
    }

    @Test
    void createQuestion_ValidInput_ReturnsCreatedQuestion() throws Exception {
        QuestionDto question = new QuestionDto();
        question.setId(1);
        question.setTitle("New Question");

        when(questionService.createQuestion(any(QuestionDto.class))).thenReturn(question);

        mockMvc.perform(post("/api/question")
                .with(csrf()) // Adding CSRF token
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(question)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Question"));
    }

    @Test
    void updateQuestion_ExistingId_ReturnsUpdatedQuestion() throws Exception {
        QuestionDto updatedQuestion = new QuestionDto();
        updatedQuestion.setId(1);
        updatedQuestion.setTitle("Updated Title");

        when(questionService.updateQuestion(Mockito.eq(1), any(QuestionDto.class))).thenReturn(updatedQuestion);

        mockMvc.perform(put("/api/question/1")
                .with(csrf()) // Adding CSRF token
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedQuestion)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void deleteQuestion_ExistingId_ReturnsSuccessMessage() throws Exception {
        when(questionService.deleteQuestion(1)).thenReturn("Question with ID 1 has been deleted.");

        mockMvc.perform(delete("/api/question/1")
                .with(csrf())) // Adding CSRF token
                .andExpect(status().isOk())
                .andExpect(content().string("Question with ID 1 has been deleted."));
    }

    @Test
    void deleteQuestion_NonExistingId_ReturnsNotFound() throws Exception {
        when(questionService.deleteQuestion(99)).thenThrow(new QuestionNotFoundException("Question not found"));

        mockMvc.perform(delete("/api/question/99")
                .with(csrf())) // Adding CSRF token
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Question not found"));
    }
}