package org.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import reactor.core.publisher.Mono;

@Configuration
public class AuthHeaderFilter {

    @Bean
    public GlobalFilter forwardAuthToken() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader != null && !authHeader.isEmpty()) {
                ServerHttpRequest mutated = request.mutate()
                        .header(HttpHeaders.AUTHORIZATION, authHeader)
                        .build();
                return chain.filter(exchange.mutate().request(mutated).build());
            }

            return chain.filter(exchange);
        };
    }
}
