package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Demand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemandRepository
        extends JpaRepository<Demand, Long> {
}