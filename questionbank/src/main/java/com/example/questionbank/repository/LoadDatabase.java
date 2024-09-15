//package com.example.questionbank.repository;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import com.example.questionbank.model.Question;
//
//import java.util.Arrays;
//
//@Configuration
//class LoadDatabase {
//
//    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);
//
//    @Bean
//    CommandLineRunner initDatabase(QuestionRepository repository) {
//
//        return args -> {
//            log.info("Preloading " + repository.save(new Question("Reverse a String",
//                    "Write a function that reverses a string. The input string is given as an array of characters s. \n" +
//                            "\n" +
//                            "You must do this by modifying the input array in-place with O(1) extra memory. \n" +
//                            "\n" +
//                            "Example 1:\n" +
//                            "\n" +
//                            "Input: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\n" +
//                            "Output: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n" +
//                            "\n" +
//                            "Example 2:\n" +
//                            "Input: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\n" +
//                            "Output: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n" +
//                            "\n" +
//                            "Constraints:\n" +
//                            "\n" +
//                            "1 <= s.length <= 105\n" +
//                            "s[i] is a printable ascii character.\n",
//                        Arrays.asList("Strings", "Algorithms"), // Multiple categories
//                    "Easy")));
//            log.info("Preloading " + repository.save(new Question("Linked List Cycle Detection",
//                    "Implement a function to detect if a linked list contains a cycle.",
//                    Arrays.asList("Data Structures", "Algorithms"), // Multiple categories
//                    "Easy")));
//        };
//    }
//}