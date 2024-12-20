package com.classmate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OAuth2Controller {
    @GetMapping("/login/oauth2/code/google")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam("code") String code) {
        return ResponseEntity.ok("User info");
    }
}