package g55.cs3219.backend.matchingservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g55.cs3219.backend.matchingservice.model.MatchingRequest;
import g55.cs3219.backend.matchingservice.service.MatchingProducer;

@RestController
@RequestMapping("/api/match")
public class MatchingController {

    private final MatchingProducer matchingProducer;

    public MatchingController(MatchingProducer matchingProducer) {
        this.matchingProducer = matchingProducer;
    }

    @PostMapping
    public ResponseEntity<String> requestMatch(@RequestBody MatchingRequest request) {
        matchingProducer.sendMatchingRequest(request);
        return ResponseEntity.ok("Matching request sent");
    }
}