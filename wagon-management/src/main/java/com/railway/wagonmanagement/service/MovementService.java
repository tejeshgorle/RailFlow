package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.exception.InvalidMovementException;
import com.railway.wagonmanagement.exception.StationNotFoundException;
import com.railway.wagonmanagement.exception.WagonNotFoundException;
import com.railway.wagonmanagement.model.Movement;
import com.railway.wagonmanagement.model.Station;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonStatus;
import com.railway.wagonmanagement.repository.MovementRepository;
import com.railway.wagonmanagement.repository.StationRepository;
import com.railway.wagonmanagement.repository.WagonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovementService {

    private final MovementRepository movementRepository;
    private final WagonRepository wagonRepository;
    private final StationRepository stationRepository;

    public MovementService(
            MovementRepository movementRepository,
            WagonRepository wagonRepository,
            StationRepository stationRepository) {

        this.movementRepository = movementRepository;
        this.wagonRepository = wagonRepository;
        this.stationRepository = stationRepository;
    }

    @Transactional
    public Movement createMovement(
            Long wagonId,
            Long fromStationId,
            Long toStationId) {

        // 1. Validate Wagon ID
        if (wagonId == null) {
            throw new InvalidMovementException(
                    "Wagon ID is required"
            );
        }

        // 2. Validate From Station ID
        if (fromStationId == null) {
            throw new InvalidMovementException(
                    "From station ID is required"
            );
        }

        // 3. Validate To Station ID
        if (toStationId == null) {
            throw new InvalidMovementException(
                    "To station ID is required"
            );
        }

        // 4. Find wagon
        Wagon wagon = wagonRepository.findById(wagonId)
                .orElseThrow(() ->
                        new WagonNotFoundException(
                                "Wagon not found with id: " + wagonId
                        )
                );

        // 5. Find from station
        Station fromStation = stationRepository.findById(fromStationId)
                .orElseThrow(() ->
                        new StationNotFoundException(
                                "From station not found with id: "
                                        + fromStationId
                        )
                );

        // 6. Find to station
        Station toStation = stationRepository.findById(toStationId)
                .orElseThrow(() ->
                        new StationNotFoundException(
                                "To station not found with id: "
                                        + toStationId
                        )
                );

        // 7. Check same station
        if (fromStation.getStationId()
                .equals(toStation.getStationId())) {

            throw new InvalidMovementException(
                    "From station and to station cannot be the same"
            );
        }

        // 8. Check whether wagon has a current station
        if (wagon.getStation() == null) {

            throw new InvalidMovementException(
                    "Wagon does not have a current station"
            );
        }

        // 9. Check wagon's current location
        if (!wagon.getStation().getStationId()
                .equals(fromStation.getStationId())) {

            throw new InvalidMovementException(
                    "Wagon is not currently at the from station"
            );
        }

        // 10. Check wagon operational status
        if (wagon.getStatus() != WagonStatus.AVAILABLE &&
                wagon.getStatus() != WagonStatus.EMPTY) {

            throw new InvalidMovementException(
                    "Only AVAILABLE or EMPTY wagons can be moved"
            );
        }

        // 11. Create movement record
        Movement movement = new Movement();

        movement.setWagon(wagon);
        movement.setFromStation(fromStation);
        movement.setToStation(toStation);
        movement.setMovementTime(LocalDateTime.now());

        // 12. Save movement
        Movement savedMovement =
                movementRepository.save(movement);

        // 13. Update wagon's current station
        wagon.setStation(toStation);

        wagonRepository.save(wagon);

        // 14. Return movement
        return savedMovement;
    }

    @Transactional
        public Movement recordRakeMovement(
                Wagon wagon,
                Station fromStation,
                Station toStation,
                LocalDateTime movementTime) {

        // 1. Validate wagon
        if (wagon == null) {
                throw new InvalidMovementException(
                        "Wagon is required"
                );
        }

        // 2. Validate from station
        if (fromStation == null) {
                throw new InvalidMovementException(
                        "From station is required"
                );
        }

        // 3. Validate to station
        if (toStation == null) {
                throw new InvalidMovementException(
                        "To station is required"
                );
        }

        // 4. Stations cannot be the same
        if (fromStation.getStationId()
                .equals(toStation.getStationId())) {

                throw new InvalidMovementException(
                        "From station and to station cannot be the same"
                );
        }

        // 5. Wagon must have a current station
        if (wagon.getStation() == null) {
                throw new InvalidMovementException(
                        "Wagon does not have a current station"
                );
        }

        // 6. Wagon must currently be at the from station
        if (!wagon.getStation().getStationId()
                .equals(fromStation.getStationId())) {

                throw new InvalidMovementException(
                        "Wagon is not currently at the from station"
                );
        }

        // 7. Rake movement is only for LOADED wagons
        if (wagon.getStatus() != WagonStatus.LOADED) {

                throw new InvalidMovementException(
                        "Only LOADED wagons can be moved as part of a rake"
                );
        }

        // 8. Create movement record
        Movement movement = new Movement();

        movement.setWagon(wagon);
        movement.setFromStation(fromStation);
        movement.setToStation(toStation);

        if (movementTime == null) {
                movement.setMovementTime(LocalDateTime.now());
        } else {
                movement.setMovementTime(movementTime);
        }

        // 9. Save movement
        Movement savedMovement =
                movementRepository.save(movement);

        // 10. Update wagon's current station
        wagon.setStation(toStation);

        wagonRepository.save(wagon);

        return savedMovement;
        }
    public List<Movement> getAllMovements() {
        return movementRepository.findAll();
    }
}