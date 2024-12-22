package com.classmate.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@CrossOrigin("*")
public class HomeController {

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
