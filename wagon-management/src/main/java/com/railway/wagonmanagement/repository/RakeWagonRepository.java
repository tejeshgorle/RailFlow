package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Rake;
import com.railway.wagonmanagement.model.RakeWagon;
import com.railway.wagonmanagement.model.Wagon;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RakeWagonRepository
        extends JpaRepository<RakeWagon, Long> {

    boolean existsByRakeAndWagon(Rake rake, Wagon wagon);

    List<RakeWagon> findByRake(Rake rake);
}