package com.classmate.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String welcomePage() {
        return "welcome";
    }

    @GetMapping("/result")
    public String successPage() {
        return "result";
    }

    @GetMapping("/api/school/new")
    public String createNewSchool(){
        return "makenewschool";
    }

    @GetMapping("/index")
    public String indexPage() {
        return "index";
    }
}
