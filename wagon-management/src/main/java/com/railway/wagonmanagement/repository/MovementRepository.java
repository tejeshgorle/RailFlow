package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Movement;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovementRepository extends JpaRepository<Movement, Long> {

    List<Movement> findAllByOrderByMovementTimeDesc(Pageable pageable);
}