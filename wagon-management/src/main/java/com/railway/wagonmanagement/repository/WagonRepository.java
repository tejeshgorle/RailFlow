package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Wagon;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WagonRepository extends JpaRepository<Wagon, Long> {

    boolean existsByWagonNumberIgnoreCase(String wagonNumber);
}