/* package com.classmate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Omogućava CORS za sve rute
                        .allowedOrigins("http://localhost:3000") // URL gdje se pokreće frontend aplikacija
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Dopuštene metode
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
} */