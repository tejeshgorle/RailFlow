package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Demand;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsignmentRepository
        extends JpaRepository<Consignment, Long> {

    boolean existsByDemand(Demand demand);
}