package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.exception.InvalidStationException;
import com.railway.wagonmanagement.exception.StationNotFoundException;
import com.railway.wagonmanagement.model.Station;
import com.railway.wagonmanagement.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    // =========================================================
    // GET ALL STATIONS
    // =========================================================

    public List<Station> getAllStations() {

        return stationRepository.findAll();
    }

    // =========================================================
    // CREATE STATION
    // =========================================================

    public Station createStation(Station station) {

        // -------------------------------------------------
        // 1. Station object validation
        // -------------------------------------------------

        if (station == null) {

            throw new InvalidStationException(
                    "Station information is required");
        }

        // -------------------------------------------------
        // 2. Station code validation
        // -------------------------------------------------

        if (station.getStationCode() == null ||
                station.getStationCode().trim().isEmpty()) {

            throw new InvalidStationException(
                    "Station code is required");
        }

        String stationCode =
                station.getStationCode()
                        .trim()
                        .toUpperCase();

        // -------------------------------------------------
        // 3. Station code format validation
        // -------------------------------------------------

        if (!stationCode.matches("[A-Z]{2,5}")) {

            throw new InvalidStationException(
                    "Station code must contain 2 to 5 alphabetic characters");
        }

        // -------------------------------------------------
        // 4. Duplicate station code validation
        // -------------------------------------------------

        if (stationRepository.existsByStationCodeIgnoreCase(
                stationCode)) {

            throw new InvalidStationException(
                    "Station already exists with code: "
                            + stationCode);
        }

        // -------------------------------------------------
        // 5. Station name validation
        // -------------------------------------------------

        if (station.getStationName() == null ||
                station.getStationName().trim().isEmpty()) {

            throw new InvalidStationException(
                    "Station name is required");
        }

        String stationName =
                station.getStationName().trim();

        if (stationName.length() < 2 ||
                stationName.length() > 100) {

            throw new InvalidStationException(
                    "Station name must be between 2 and 100 characters");
        }

        // -------------------------------------------------
        // 6. Zone validation
        // -------------------------------------------------

        if (station.getZone() == null ||
                station.getZone().trim().isEmpty()) {

            throw new InvalidStationException(
                    "Zone is required");
        }

        String zone =
                station.getZone().trim().toUpperCase();

        // -------------------------------------------------
        // 7. Division validation
        // -------------------------------------------------

        if (station.getDivision() == null ||
                station.getDivision().trim().isEmpty()) {

            throw new InvalidStationException(
                    "Division is required");
        }

        String division =
                station.getDivision().trim().toUpperCase();

        // -------------------------------------------------
        // 8. Store cleaned values
        // -------------------------------------------------

        station.setStationCode(stationCode);
        station.setStationName(stationName);
        station.setZone(zone);
        station.setDivision(division);

        // -------------------------------------------------
        // 9. Save station
        // -------------------------------------------------

        return stationRepository.save(station);
    }

    // =========================================================
    // GET STATION BY ID
    // =========================================================

    public Station getStationById(Long id) {

        return stationRepository.findById(id)
                .orElseThrow(() ->
                        new StationNotFoundException(
                                "Station not found with id: " + id
                        )
                );
    }
}