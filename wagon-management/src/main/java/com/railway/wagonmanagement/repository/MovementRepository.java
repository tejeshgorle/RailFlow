package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Movement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementRepository extends JpaRepository<Movement, Long> {
}