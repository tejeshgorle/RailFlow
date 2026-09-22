package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Station;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Long> {

    boolean existsByStationCodeIgnoreCase(String stationCode);
}