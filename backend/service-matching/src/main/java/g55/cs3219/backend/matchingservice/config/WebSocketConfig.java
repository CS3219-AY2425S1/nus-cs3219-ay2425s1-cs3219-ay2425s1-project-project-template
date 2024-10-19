package g55.cs3219.backend.matchingservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import g55.cs3219.backend.matchingservice.service.MatchingWebSocketHandler;
import g55.cs3219.backend.matchingservice.service.NotificationService;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final NotificationService notificationService;

    public WebSocketConfig(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new MatchingWebSocketHandler(notificationService), "/ws/matching")
                .setAllowedOrigins("*"); // Be careful with this in production
    }
}