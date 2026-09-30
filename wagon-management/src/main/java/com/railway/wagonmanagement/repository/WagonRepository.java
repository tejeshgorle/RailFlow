package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WagonRepository extends JpaRepository<Wagon, Long> {

    boolean existsByWagonNumberIgnoreCase(String wagonNumber);

    List<Wagon> findByStatus(WagonStatus status);
}