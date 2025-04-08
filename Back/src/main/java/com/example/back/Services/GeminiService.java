package com.example.back.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String GEMINI_API_KEY;

    private final WebClient webClient;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public String generateAutoReply(String userMessage) {
        String url = "/v1/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", userMessage)))
                )
        );

        return webClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(requestBody), Map.class)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                            System.out.println("❌ Gemini API Error Response: " + errorBody);
                            return Mono.error(new RuntimeException("Gemini API error: " + errorBody));
                        })
                )
                .bodyToMono(Map.class)
                .map(response -> {
                    System.out.println("✅ Gemini raw response: " + response);
                    List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                    String reply = parts.get(0).get("text");
                    System.out.println("✅ Gemini AI Reply: " + reply);
                    return reply;
                })
                .onErrorResume(error -> {
                    System.out.println("❌ Gemini Exception: " + error.getMessage());
                    return Mono.just("Nous avons bien reçu votre réclamation. Un agent vous contactera bientôt.");
                })
                .block();
    }

}
