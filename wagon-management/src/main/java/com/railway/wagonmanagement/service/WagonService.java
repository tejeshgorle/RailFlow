package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.exception.InvalidWagonException;
import com.railway.wagonmanagement.exception.WagonNotFoundException;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonStatus;
import com.railway.wagonmanagement.repository.WagonRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WagonService {

    private final WagonRepository wagonRepository;

    public WagonService(WagonRepository wagonRepository) {
        this.wagonRepository = wagonRepository;
    }

    // =========================================================
    // GET ALL WAGONS
    // =========================================================

    public List<Wagon> getAllWagons() {

        return wagonRepository.findAll();
    }

    // =========================================================
    // GET WAGON BY ID
    // =========================================================

    public Wagon getWagonById(Long id) {

        return wagonRepository.findById(id)
                .orElseThrow(() ->
                        new WagonNotFoundException(
                                "Wagon not found with id: " + id
                        )
                );
    }

    // =========================================================
    // CREATE WAGON
    // =========================================================

    public Wagon createWagon(Wagon wagon) {

        // -------------------------------------------------
        // 1. Wagon object validation
        // -------------------------------------------------

        if (wagon == null) {

            throw new InvalidWagonException(
                    "Wagon information is required");
        }

        // -------------------------------------------------
        // 2. Wagon number validation
        // -------------------------------------------------

        if (wagon.getWagonNumber() == null ||
                wagon.getWagonNumber().trim().isEmpty()) {

            throw new InvalidWagonException(
                    "Wagon number is required");
        }

        String wagonNumber =
                wagon.getWagonNumber().trim();

        // -------------------------------------------------
        // 3. Wagon number length validation
        // -------------------------------------------------

        if (wagonNumber.length() < 3 ||
                wagonNumber.length() > 20) {

            throw new InvalidWagonException(
                    "Wagon number must be between 3 and 20 characters");
        }

        // -------------------------------------------------
        // 4. Duplicate wagon number validation
        // -------------------------------------------------

        if (wagonRepository.existsByWagonNumberIgnoreCase(
                wagonNumber)) {

            throw new InvalidWagonException(
                    "Wagon already exists with number: "
                            + wagonNumber);
        }

        // -------------------------------------------------
        // 5. Wagon type validation
        // -------------------------------------------------

        if (wagon.getWagonType() == null ||
                wagon.getWagonType().trim().isEmpty()) {

            throw new InvalidWagonException(
                    "Wagon type is required");
        }

        String wagonType =
                wagon.getWagonType().trim();

        if (wagonType.length() > 50) {

            throw new InvalidWagonException(
                    "Wagon type cannot exceed 50 characters");
        }

        // -------------------------------------------------
        // 6. Capacity validation
        // -------------------------------------------------

        if (wagon.getCapacity() == null ||
                wagon.getCapacity() <= 0) {

            throw new InvalidWagonException(
                    "Wagon capacity must be greater than zero");
        }

        // -------------------------------------------------
        // 7. Set initial status
        // -------------------------------------------------

        wagon.setStatus(WagonStatus.AVAILABLE);

        // -------------------------------------------------
        // 8. Store cleaned values
        // -------------------------------------------------

        wagon.setWagonNumber(wagonNumber);
        wagon.setWagonType(wagonType);

        // -------------------------------------------------
        // 9. Save wagon
        // -------------------------------------------------

        return wagonRepository.save(wagon);
    }

    // =========================================================
    // UPDATE WAGON
    // =========================================================

    public Wagon updateWagon(
            Long id,
            Wagon wagonDetails) {

        // -------------------------------------------------
        // 1. Find existing wagon
        // -------------------------------------------------

        Wagon existingWagon =
                wagonRepository.findById(id)
                        .orElseThrow(() ->
                                new WagonNotFoundException(
                                        "Wagon not found with id: " + id
                                )
                        );

        // -------------------------------------------------
        // 2. Request object validation
        // -------------------------------------------------

        if (wagonDetails == null) {

            throw new InvalidWagonException(
                    "Wagon information is required");
        }

        // -------------------------------------------------
        // 3. Wagon number validation
        // -------------------------------------------------

        if (wagonDetails.getWagonNumber() == null ||
                wagonDetails.getWagonNumber()
                        .trim().isEmpty()) {

            throw new InvalidWagonException(
                    "Wagon number is required");
        }

        String wagonNumber =
                wagonDetails.getWagonNumber().trim();

        if (wagonNumber.length() < 3 ||
                wagonNumber.length() > 20) {

            throw new InvalidWagonException(
                    "Wagon number must be between 3 and 20 characters");
        }

        // -------------------------------------------------
        // 4. Check duplicate wagon number
        // -------------------------------------------------

        if (!existingWagon.getWagonNumber()
                .equalsIgnoreCase(wagonNumber) &&
                wagonRepository.existsByWagonNumberIgnoreCase(
                        wagonNumber)) {

            throw new InvalidWagonException(
                    "Wagon already exists with number: "
                            + wagonNumber);
        }

        // -------------------------------------------------
        // 5. Wagon type validation
        // -------------------------------------------------

        if (wagonDetails.getWagonType() == null ||
                wagonDetails.getWagonType()
                        .trim().isEmpty()) {

            throw new InvalidWagonException(
                    "Wagon type is required");
        }

        String wagonType =
                wagonDetails.getWagonType().trim();

        if (wagonType.length() > 50) {

            throw new InvalidWagonException(
                    "Wagon type cannot exceed 50 characters");
        }

        // -------------------------------------------------
        // 6. Capacity validation
        // -------------------------------------------------

        if (wagonDetails.getCapacity() == null ||
                wagonDetails.getCapacity() <= 0) {

            throw new InvalidWagonException(
                    "Wagon capacity must be greater than zero");
        }

        // -------------------------------------------------
        // 7. Update basic wagon information
        // -------------------------------------------------

        existingWagon.setWagonNumber(wagonNumber);
        existingWagon.setWagonType(wagonType);
        existingWagon.setCapacity(
                wagonDetails.getCapacity());

        // -------------------------------------------------
        // IMPORTANT:
        // Do NOT update wagon status here.
        // Status is controlled by business workflows.
        // -------------------------------------------------

        return wagonRepository.save(existingWagon);
    }

    // =========================================================
    // DELETE WAGON
    // =========================================================

    public void deleteWagon(Long id) {

        Wagon existingWagon =
                wagonRepository.findById(id)
                        .orElseThrow(() ->
                                new WagonNotFoundException(
                                        "Wagon not found with id: " + id
                                )
                        );

        // -------------------------------------------------
        // Do not delete an operational wagon
        // -------------------------------------------------

        if (existingWagon.getStatus() != WagonStatus.AVAILABLE) {

            throw new InvalidWagonException(
                    "Only AVAILABLE wagons can be deleted");
        }

        wagonRepository.delete(existingWagon);
    }
}