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

        // 3. Pronađi slobodnog razrednika
        Teacher availableTeacher = teacherRepository.findFirstByIsClassTeacherFalseOrIsClassTeacherNull()
            .orElseThrow(() -> new RuntimeException("Nema dostupnih razrednika."));

        // 4. Dodijeli razredniku učenika i postavi isClassTeacher na TRUE
        user.setClassTeacherId(availableTeacher.getTeacherId());
        availableTeacher.setIsClassTeacher(true);
        teacherRepository.save(availableTeacher);

        // 5. Dodjela razreda (GradeNumber)
        Integer nextGradeNumber = user.getGradeNumber() == null ? 1 : user.getGradeNumber() + 1;
        if (nextGradeNumber > 4) {
            throw new RuntimeException("Upis nije moguć. Maksimalni broj razreda je 4.");
        }
        user.setGradeNumber(nextGradeNumber);

        // 6. Dodjela slova razreda (GradeLetter)
        List<User> sameGradeUsers = userRepository.findBySchool_SchoolIdAndProgramme_ProgrammeIdAndGradeNumber(
                user.getSchool().getSchoolId(), 
                user.getProgramme().getProgrammeId(), 
                nextGradeNumber
        );

        // Prebroji korisnike po slovo razreda
        Map<Character, Long> gradeLetterCounts = sameGradeUsers.stream()
                .filter(u -> u.getGradeLetter() != null)
                .collect(Collectors.groupingBy(User::getGradeLetter, Collectors.counting()));

        // Provjeri koja su slova slobodna (A-F)
        char assignedLetter = 0;
        for (char letter = 'A'; letter <= 'F'; letter++) {
            Long count = gradeLetterCounts.getOrDefault(letter, 0L);
            if (count < 25) {
                assignedLetter = letter;
                break;
            }
        }

        if (assignedLetter == 0) {
            throw new RuntimeException("Sva mjesta u razredima su popunjena.");
        }

        user.setGradeLetter(assignedLetter);

        // 7. Spremi ažuriranog korisnika
        userRepository.save(user);
    }
}
