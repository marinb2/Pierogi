package com.classmate.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.classmate.model.Schedule;
import com.classmate.model.Subject;
import com.classmate.repository.ScheduleRepository;
import com.classmate.repository.SubjectRepository;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    private static final List<LocalTime> TIME_SLOTS = Arrays.asList(
            LocalTime.of(8, 0),
            LocalTime.of(9, 0),
            LocalTime.of(10, 0),
            LocalTime.of(11, 0),
            LocalTime.of(12, 0),
            LocalTime.of(13, 0)
    );

    private static final List<Character> GRADE_LETTERS = Arrays.asList('A', 'B', 'C', 'D', 'E', 'F');

    public void generateScheduleForAcademicYear() {
        List<Subject> allSubjects = subjectRepository.findAll();

        for (int gradeNumber = 1; gradeNumber <= 4; gradeNumber++) {
            for (Character gradeLetter : GRADE_LETTERS) {
                generateScheduleForClass(gradeNumber, gradeLetter, allSubjects);
            }
        }
    }

    private void generateScheduleForClass(int gradeNumber, Character gradeLetter, List<Subject> subjects) {
        Random random = new Random();
        Set<LocalDateTime> occupiedSlots = new HashSet<>();

        for (Subject subject : subjects) {
            for (int i = 0; i < 3; i++) {  // Svaki predmet 3 puta tjedno
                LocalDateTime slot;

                do {
                    int dayOfWeek = random.nextInt(5) + 1; // Ponedjeljak - Petak
                    LocalTime startTime = TIME_SLOTS.get(random.nextInt(TIME_SLOTS.size()));

                    // ✅ Ispravljeno: Korištenje TemporalAdjusters za postavljanje dana
                    slot = LocalDateTime.now()
                            .with(TemporalAdjusters.nextOrSame(DayOfWeek.of(dayOfWeek)))
                            .withHour(startTime.getHour())
                            .withMinute(startTime.getMinute())
                            .withSecond(0)
                            .withNano(0);

                } while (occupiedSlots.contains(slot));  // Provjera da nema preklapanja

                occupiedSlots.add(slot);

                Schedule schedule = new Schedule();
                schedule.setSubject(subject);
                schedule.setGradeNumber(gradeNumber);
                schedule.setGradeLetter(gradeLetter);
                schedule.setStartTime(slot);
                schedule.setEndTime(slot.plusMinutes(45));  // Sat traje 45 minuta
                schedule.setClassroom("Učionica " + (random.nextInt(10) + 1));

                scheduleRepository.save(schedule);
            }
        }
    }

    public List<Schedule> getScheduleForClass(Integer gradeNumber, Character gradeLetter) {
        return scheduleRepository.findByGradeNumberAndGradeLetter(gradeNumber, gradeLetter);
    }
}
