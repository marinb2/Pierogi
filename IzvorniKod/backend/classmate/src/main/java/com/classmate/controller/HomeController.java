package com.classmate.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    // Inicijalizacija loggera
    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @GetMapping("/")
    public String welcomePage() {
        logger.debug("Pozvana metoda welcomePage() - prikazivanje 'welcome.html'");
        return "Hello, home!"; // Pretpostavka da je 'welcome.html' u 'src/main/resources/templates'
    }

    @GetMapping("/secured")
    public String securePage() {
        logger.debug("Pozvana metoda welcomePage() - prikazivanje 'welcome.html'");
        return "Hello, secured!";
    }
}
