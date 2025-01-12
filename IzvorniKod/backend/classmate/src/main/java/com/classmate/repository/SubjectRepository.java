package com.classmate.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    /* @Query("SELECT s FROM Subject s JOIN Programme s where s.ProgrammeId == ?1")
    List<Subject> getByProgrammeId(Long id); */
}
