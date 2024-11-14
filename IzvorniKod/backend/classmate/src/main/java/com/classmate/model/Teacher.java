package com.classmate.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToOne
    private Subject professed_subject;

    @OneToMany(mappedBy = "teacher")
    private List<UnavailableTime> unavailableTimes;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Subject getProfessedSubject() {
        return professed_subject;
    }

    public void getProfessedSubject(Subject subject) {
        this.professed_subject = subject;
    }

    public List<UnavailableTime> getUnavailableTimes() {
        return unavailableTimes;
    }

    public void setUnavailableTimes(List<UnavailableTime> unavailableTimes) {
        this.unavailableTimes = unavailableTimes;
    }

}
