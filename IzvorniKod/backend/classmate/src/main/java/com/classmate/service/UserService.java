package com.classmate.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.classmate.model.Teacher;
import com.classmate.model.User;
import com.classmate.repository.TeacherRepository;
import com.classmate.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void enrollUser(String email) {
        // 1. Pronađi korisnika prema emailu
        User user = userRepository.findByEmail(email)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen."));
    
        // 2. Provjera da li korisnik već ima dodijeljen razred
        if (user.getGradeNumber() != null && user.getGradeLetter() != null) {
            throw new RuntimeException("Korisnik je već upisan u razred.");
        }
    
        // 3. Postavi početni broj razreda
        Integer nextGradeNumber = user.getGradeNumber() == null ? 1 : user.getGradeNumber() + 1;
        if (nextGradeNumber > 4) {
            throw new RuntimeException("Upis nije moguć. Maksimalni broj razreda je 4.");
        }
    
        // 4. Pronađi sve razrednike za određeni razred
        List<Teacher> classTeachers = teacherRepository.findByIsClassTeacherTrue();
    
        boolean assigned = false;
    
        // 5. Pokušaj dodijeliti korisnika postojećem razredniku s manjim od 25 učenika
        for (char letter = 'A'; letter <= 'F'; letter++) {
            for (Teacher teacher : classTeachers) {
                List<User> studentsInClass = userRepository.findByClassTeacherIdAndGradeNumberAndGradeLetter(
                        teacher.getTeacherId(), nextGradeNumber, letter);
    
                if (studentsInClass.size() < 25) {
                    // Dodijeli korisnika razredniku i razredu
                    user.setClassTeacherId(teacher.getTeacherId());
                    user.setGradeNumber(nextGradeNumber);
                    user.setGradeLetter(letter);
    
                    userRepository.save(user);
                    assigned = true;
                    break;
                }
            }
            if (assigned) break;
        }
    
        // 6. Ako nema mjesta u postojećim razredima, kreiraj novi razred s dostupnim profesorom
        if (!assigned) {
            // Pronađi slobodnog profesora koji nije razrednik
            Teacher availableTeacher = teacherRepository.findFirstByIsClassTeacherFalseOrIsClassTeacherNull()
                    .orElseThrow(() -> new RuntimeException("Nema dostupnih profesora za novi razred."));
    
            // Postavi profesora kao razrednika
            availableTeacher.setIsClassTeacher(true);
            teacherRepository.save(availableTeacher);
    
            // Dodijeli novo slovo razreda (A-F)
            for (char letter = 'A'; letter <= 'F'; letter++) {
                List<User> studentsInNewClass = userRepository.findByGradeNumberAndGradeLetter(nextGradeNumber, letter);
                if (studentsInNewClass.isEmpty()) {
                    // Dodijeli korisnika u novi razred
                    user.setClassTeacherId(availableTeacher.getTeacherId());
                    user.setGradeNumber(nextGradeNumber);
                    user.setGradeLetter(letter);
    
                    userRepository.save(user);
                    assigned = true;
                    break;
                }
            }
    
            if (!assigned) {
                throw new RuntimeException("Nema dostupnih mjesta za novi razred.");
            }
        }
    }
}
