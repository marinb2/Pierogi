package com.classmate.config;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS in Spring Security
            .csrf(csrf -> csrf.disable()) // Disable CSRF protection if it's not needed (e.g., for REST APIs)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/favicon.ico", "/error", "/login/*", "/oauth2/*", "api/**").permitAll() // Permit OAuth-related endpoints
                .requestMatchers("/", "/favicon.ico", "/error", "/oauth2/authorization/google", "/login/oauth2/code/google").permitAll() // Permit OAuth-related endpoints
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll() // Example: Allow unauthenticated access to user registration endpoint
                .anyRequest().authenticated() // Require authentication for other endpoints
            )
            .oauth2Login(oauth2 -> oauth2.loginPage("/oauth2/authorization/google")
                .defaultSuccessUrl("https://pierogi-theta.vercel.app/register", true) // Redirect to frontend after successful login
            )
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://pierogi-theta.vercel.app")); // Allow requests from frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With")); // Allowed headers
        configuration.setAllowCredentials(true); // Allow cookies/auth headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply CORS settings to all endpoints
        return source;
    }
}
