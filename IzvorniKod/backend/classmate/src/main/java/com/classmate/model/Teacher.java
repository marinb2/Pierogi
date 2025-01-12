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

    private boolean isClassTeacher;

    @OneToOne
    private Subject professed_subject;

    @OneToMany(mappedBy = "teacher")
    private List<UnavailableTime> unavailableTimes;

    // Getters and Setters

    public Long getTeacherId() {
        return id;
    }    

    public void setTeacherId(Long teacherId) {
        this.id = id;
    }

    public String getTeacherName() {
        return name;
    }

    public void setTeacherName(String name) {
        this.name = name;
    }

    public Subject getProfessedSubject() {
        return professed_subject;
    }

    public void setProfessedSubject(Subject professed_subject) {
        this.professed_subject = professed_subject;
    }

    public List<UnavailableTime> getUnavailableTimes() {
        return unavailableTimes;
    }

    public void setUnavailableTimes(List<UnavailableTime> unavailableTimes) {
        this.unavailableTimes = unavailableTimes;
    }

    public boolean isClassTeacher() {
        return isClassTeacher;
    }

    public void setIsClassTeacher(boolean isClassTeacher) {
        this.isClassTeacher = isClassTeacher;
    }
}
