package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.EstablishedConvos;

@Repository
public interface EstablishedConvosRepository extends JpaRepository<EstablishedConvos, Long>{

}
