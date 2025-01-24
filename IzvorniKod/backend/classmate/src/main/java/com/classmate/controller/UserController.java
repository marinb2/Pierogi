package com.classmate.controller;

import java.util.GregorianCalendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.User;
import com.classmate.service.UserService;

import io.getstream.chat.java.models.framework.StreamRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping(value = "", consumes = { "application/json" })
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/getByEmail")
    public List<User> getUserByEmail(@RequestParam String email){
        List<User> users = userService.getUserByEmail(email);
        return users;
    }

    @PostMapping("/enroll")
    public ResponseEntity<String> enrollUser(@RequestParam String email) {
        try {
            userService.enrollUser(email);
            return ResponseEntity.ok("Uspješno ste upisani!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Greška prilikom upisa: " + e.getMessage());
        }
    }

    @GetMapping("/chattoken")
    public String chatToken(@RequestParam String id){
        var calendar = new GregorianCalendar();
        calendar.add(calendar.MINUTE, 60);
        System.out.println("-*_*_*__*-*_*_*__*-*_*_*__*-*_*_*__*-*_*_*__*-*_*_*__*-*_*_*__*-*_*_*__*-*_*_*__*");
        //String token = io.getstream.chat.java.models.User.createToken("john", null, null);
        //System.out.println(token);
        System.out.println(System.getenv("STREAM_KEY"));
        
        return io.getstream.chat.java.models.User.createToken(id, calendar.getTime(), null);
    }

}
