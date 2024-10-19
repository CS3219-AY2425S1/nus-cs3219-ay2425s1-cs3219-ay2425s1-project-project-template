package g55.cs3219.backend.matchingservice.service;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import g55.cs3219.backend.matchingservice.model.MatchingRequest;

@Service
public class MatchingConsumer {

    private final MatchingService matchingService;
    private final NotificationService notificationService;

    public MatchingConsumer(MatchingService matchingService, NotificationService notificationService) {
        this.matchingService = matchingService;
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = "matchingQueue")
    public void processMatchingRequest(MatchingRequest request) {
        System.out.println("Received matching request: " + request);
        
        // Try to find a match
        Optional<MatchingRequest> match = matchingService.findMatch(request);
        
        if (match.isPresent()) {
            // Match found
            MatchingRequest matchedUser = match.get();
            notificationService.notifyMatched(request.getUserId(), matchedUser.getUserId());
            notificationService.notifyMatched(matchedUser.getUserId(), request.getUserId());
        } else {
            // No immediate match, start timeout
            startMatchingTimeout(request);
        }
    }

    private void startMatchingTimeout(MatchingRequest request) {
        CompletableFuture.delayedExecutor(30, TimeUnit.SECONDS).execute(() -> {
            boolean removed = matchingService.removeFromWaiting(request.getUserId());
            if (removed) {
                // If the user was still in the waiting list after 30 seconds, notify them
                notificationService.notifyTimeout(request.getUserId());
            }
        });
    }
}