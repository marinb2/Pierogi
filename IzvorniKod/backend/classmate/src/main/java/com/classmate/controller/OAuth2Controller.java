/* package com.classmate.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.net.URI;

@Controller
public class OAuth2Controller {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    @Value("${google.auth-url}")
    private String authUrl;

    // Redirect to Google for OAuth2 login
    @GetMapping("/oauth2/authorization/google")
    public void redirectToGoogle(jakarta.servlet.http.HttpServletResponse response) throws IOException {
        String googleAuthUrl = authUrl
                + "?client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&response_type=code"
                + "&scope=email%20profile";
        response.sendRedirect(googleAuthUrl);
    }

    // Handle Google OAuth2 callback
    @GetMapping("/login/oauth2/code/google")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String code) {
        // Exchange the authorization code for an access token
        // Make a POST request to Google OAuth server to obtain the token
        // Process and store the token as needed

        // Redirect the user back to the frontend after successful login
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("https://pierogi-alpha.vercel.app/register"))
                .build();
    }
} */