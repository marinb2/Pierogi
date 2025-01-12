package com.classmate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.CertificateRequest;

@Repository
public interface CertificateRequestRepository extends JpaRepository<CertificateRequest, Long> {
    List<CertificateRequest> findByStatus(CertificateRequest.Status status);
}
