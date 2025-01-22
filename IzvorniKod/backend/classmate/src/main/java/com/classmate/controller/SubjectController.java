package com.classmate.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.Subject;
import com.classmate.model.User;
import com.classmate.service.SubjectService;
import com.classmate.service.UserService;

@RestController
@RequestMapping("api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private UserService userService;


    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/{id}")
    public Optional<Subject> getSubjectById(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }

    @PostMapping
    public Subject createSubject(@RequestBody Subject subject) {
        return subjectService.createSubject(subject);
    }

    @DeleteMapping("/{id}")
    public void deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }

    @GetMapping("/getByUserEmail")
    public List<Subject> getByStudentEmail(@RequestParam String email) {

        List<User> users = userService.getUserByEmail(email);

        if (users.isEmpty()) {
            return null;
        }

        System.out.println("-------------------------------------");
        System.out.println(users.get(0).getRole().getRoleName());
        User user = users.get(0);

        if (user.getRole().getRoleName().equals("nastavnik")) {
            Optional<Subject> subject = subjectService.getSubjectById(user.getSubject().getSubjectId());
            List<Subject> return_this = new ArrayList<>();
            return_this.add(subject.get());
            return return_this;
        }

        List<Subject> all_subjects = subjectService.getAllSubjects();

        List<Subject> subjects = new ArrayList<>();

        for (int i = 0; i < all_subjects.size(); i++) {
            if (all_subjects.get(i).getProgramme().equals(user.getProgramme())) {
                subjects.add(all_subjects.get(i));
            }
        }

        return subjects;
    }
}
