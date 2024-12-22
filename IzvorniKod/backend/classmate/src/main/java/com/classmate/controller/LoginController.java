package com.classmate.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/loginform")
@CrossOrigin("*")
public class LoginController {

    @GetMapping("")
    public String LoginForm() {
        return "loginform";
    }

    

}
