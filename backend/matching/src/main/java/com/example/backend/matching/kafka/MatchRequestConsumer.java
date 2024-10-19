package com.example.backend.matching.kafka;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.backend.matching.model.VerificationResponse;

@Component
public class MatchRequestConsumer {

    private final Map<String, String> waitingRequests = new HashMap<>();

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String VERIFY_API_URL = "http://matchverification:3006/api/verify"; // TODO: Put in .env

    @KafkaListener(topics = "MATCH_REQUESTS", groupId = "matching-service")
    public void listen(@Header(KafkaHeaders.RECEIVED_KEY) String key, String value) {
        System.out.println("Received message, key: " + key + " value: " + value);

        if (waitingRequests.containsKey(key)) {
            // Match found
            String otherUserValue = waitingRequests.remove(key);

            System.out.println("Match found for key: " + key);
            System.out.println("Matching users: " + value + " and " + otherUserValue);

            List<String> matchRequests = new ArrayList<>();
            matchRequests.add(value);
            matchRequests.add(otherUserValue);

            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<List<String>> request = new HttpEntity<>(matchRequests, headers);
                ResponseEntity<VerificationResponse> response = restTemplate.exchange(
                    VERIFY_API_URL,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<VerificationResponse>() {}
                );

                if (response.getStatusCode().is2xxSuccessful()) {
                    VerificationResponse verificationResponse = response.getBody();
                    if (verificationResponse != null) {
                        System.out.println("Verification Status: " + verificationResponse.getStatus());
                        System.out.println("Message: " + verificationResponse.getMessage());
                        System.out.println("Seen Matches: " + verificationResponse.getSeenMatches());
                        System.out.println("Unseen Matches: " + verificationResponse.getUnseenMatches());
                    }
                } else {
                    System.err.println("Failed to verify match requests. Status Code: " + response.getStatusCode());
                }
            } catch (RestClientException e) {
                System.err.println("Error calling verification service: " + e.getMessage());
            }
            
        } else {
            System.out.println("No match found for key: " + key);
            waitingRequests.put(key, value);
        }
    }
}
