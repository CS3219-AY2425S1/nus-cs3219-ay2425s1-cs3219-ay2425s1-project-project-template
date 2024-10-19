package com.example.backend.matchverification.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MatchingVerificationRestController {

    @GetMapping("")
    public String greeting() {
        return "Hello from matching verification service!";
    }

}
