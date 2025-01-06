package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.CertificateType;


@Repository
public interface CertificateTypeRepository extends JpaRepository<CertificateType, Long> {
}