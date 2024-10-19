package com.example.backend.websocket.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.example.backend.websocket.kafka.producers.DisconnectProducer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Autowired
    private DisconnectProducer disconnectProducer;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // HTTP URL for the WebSocket connection used by the client
        registry.addEndpoint("/matching-websocket")
                .setHandshakeHandler(new UserHandshakeHandler())
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // routes to @MessageMapping methods in @Controller classes
        config.setApplicationDestinationPrefixes("/app");
        // defines message broker destinations: /topic for broadcasting to all subscribers, /queue for point-to-point messaging
        config.enableSimpleBroker("/topic", "/queue");
        // defines prefix for messages that are bound for a specific user
        config.setUserDestinationPrefix("/user");
    }

    // Intercepts messages coming from the client and handles disconnection events
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (accessor != null && StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                    String disconnectedUser = accessor.getUser().getName();
                    System.out.println("User disconnected: " + disconnectedUser);
                    disconnectProducer.sendMessage("DISCONNECTS", disconnectedUser, disconnectedUser);
                }
                
                return message;
            }
        });
    }
}