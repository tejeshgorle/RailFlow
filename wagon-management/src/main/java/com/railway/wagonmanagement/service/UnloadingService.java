package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.dto.UnloadingRequest;
import com.railway.wagonmanagement.exception.ConsignmentNotFoundException;
import com.railway.wagonmanagement.exception.DemandNotFoundException;
import com.railway.wagonmanagement.exception.InvalidWagonAllocationException;
import com.railway.wagonmanagement.exception.WagonNotFoundException;
import com.railway.wagonmanagement.model.AllocationStatus;
import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Demand;
import com.railway.wagonmanagement.model.Loading;
import com.railway.wagonmanagement.model.LoadingStatus;
import com.railway.wagonmanagement.model.Unloading;
import com.railway.wagonmanagement.model.UnloadingStatus;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonAllocation;
import com.railway.wagonmanagement.model.WagonStatus;
import com.railway.wagonmanagement.model.DemandStatus;
import com.railway.wagonmanagement.repository.ConsignmentRepository;
import com.railway.wagonmanagement.repository.DemandRepository;
import com.railway.wagonmanagement.repository.LoadingRepository;
import com.railway.wagonmanagement.repository.UnloadingRepository;
import com.railway.wagonmanagement.repository.WagonAllocationRepository;
import com.railway.wagonmanagement.repository.WagonRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UnloadingService {

    private final UnloadingRepository unloadingRepository;
    private final WagonRepository wagonRepository;
    private final ConsignmentRepository consignmentRepository;
    private final WagonAllocationRepository allocationRepository;
    private final LoadingRepository loadingRepository;
    private final DemandRepository demandRepository;

    public UnloadingService(
            UnloadingRepository unloadingRepository,
            WagonRepository wagonRepository,
            ConsignmentRepository consignmentRepository,
            WagonAllocationRepository allocationRepository,
            LoadingRepository loadingRepository,
            DemandRepository demandRepository) {

        this.unloadingRepository = unloadingRepository;
        this.wagonRepository = wagonRepository;
        this.consignmentRepository = consignmentRepository;
        this.allocationRepository = allocationRepository;
        this.loadingRepository = loadingRepository;
        this.demandRepository = demandRepository;
    }

    // -------------------------------------------------
    // Unload a wagon
    // -------------------------------------------------

    @Transactional
    public Unloading unloadWagon(UnloadingRequest request) {

        // -------------------------------------------------
        // 1. Validate Request
        // -------------------------------------------------

        if (request == null) {
            throw new InvalidWagonAllocationException(
                    "Unloading request cannot be null");
        }

        // -------------------------------------------------
        // 2. Validate Wagon ID
        // -------------------------------------------------

        if (request.getWagonId() == null ||
                request.getWagonId() <= 0) {

            throw new InvalidWagonAllocationException(
                    "Valid wagon ID is required");
        }

        // -------------------------------------------------
        // 3. Validate Consignment ID
        // -------------------------------------------------

        if (request.getConsignmentId() == null ||
                request.getConsignmentId() <= 0) {

            throw new InvalidWagonAllocationException(
                    "Valid consignment ID is required");
        }

        // -------------------------------------------------
        // 4. Validate Unloaded Quantity
        // -------------------------------------------------

        if (request.getUnloadedQuantity() == null ||
                request.getUnloadedQuantity() <= 0) {

            throw new InvalidWagonAllocationException(
                    "Unloaded quantity must be greater than zero");
        }

        // -------------------------------------------------
        // 5. Find Wagon
        // -------------------------------------------------

        Wagon wagon = wagonRepository.findById(
                request.getWagonId())
                .orElseThrow(() ->
                        new WagonNotFoundException(
                                "Wagon not found with id: "
                                        + request.getWagonId()));

        // -------------------------------------------------
        // 6. Find Consignment
        // -------------------------------------------------

        Consignment consignment =
                consignmentRepository
                        .findById(request.getConsignmentId())
                        .orElseThrow(() ->
                                new ConsignmentNotFoundException(
                                        "Consignment not found with id: "
                                                + request.getConsignmentId()));

        // -------------------------------------------------
        // 7. Validate Destination Station
        // -------------------------------------------------

        if (consignment.getToStation() == null) {

            throw new InvalidWagonAllocationException(
                    "Consignment destination station is required");
        }

        // -------------------------------------------------
        // 8. Check Wagon Status
        // -------------------------------------------------

        if (wagon.getStatus() != WagonStatus.LOADED) {

            throw new InvalidWagonAllocationException(
                    "Only LOADED wagons can be unloaded");
        }

        // -------------------------------------------------
        // 9. Check Wagon Location
        // -------------------------------------------------

        if (wagon.getStation() == null) {

            throw new InvalidWagonAllocationException(
                    "Wagon does not have a current station");
        }

        if (!wagon.getStation().getStationId()
                .equals(consignment.getToStation().getStationId())) {

            throw new InvalidWagonAllocationException(
                    "Wagon is not at the consignment's "
                            + "destination station");
        }

        // -------------------------------------------------
        // 10. Prevent Duplicate Unloading
        // -------------------------------------------------

        if (unloadingRepository.existsByWagonAndConsignment(
                wagon,
                consignment)) {

            throw new InvalidWagonAllocationException(
                    "Wagon has already been unloaded "
                            + "for this consignment");
        }

        // -------------------------------------------------
        // 11. Find Loading Record
        // -------------------------------------------------

        Loading loading =
                loadingRepository
                        .findByWagonAndConsignment(
                                wagon,
                                consignment)
                        .orElseThrow(() ->
                                new InvalidWagonAllocationException(
                                        "No loading record found "
                                                + "for this wagon and consignment"));

        // -------------------------------------------------
        // 12. Validate Loading Status
        // -------------------------------------------------

        if (loading.getLoadingStatus()
                != LoadingStatus.LOADED) {

            throw new InvalidWagonAllocationException(
                    "Wagon does not have a completed loading record");
        }

        // -------------------------------------------------
        // 13. Validate Loaded Quantity
        // -------------------------------------------------

        Double loadedQuantity =
                loading.getLoadedQuantity();

        if (loadedQuantity == null ||
                loadedQuantity <= 0) {

            throw new InvalidWagonAllocationException(
                    "Loaded quantity for this wagon is invalid");
        }

        // -------------------------------------------------
        // 14. Validate Unloaded Quantity
        // -------------------------------------------------

        if (!request.getUnloadedQuantity()
                .equals(loadedQuantity)) {

            throw new InvalidWagonAllocationException(
                    "Unloaded quantity must be equal "
                            + "to loaded quantity");
        }

        // -------------------------------------------------
        // 15. Find Active Allocation
        // -------------------------------------------------

        WagonAllocation allocation =
                allocationRepository
                        .findByWagonAndConsignmentAndAllocationStatus(
                                wagon,
                                consignment,
                                AllocationStatus.ALLOCATED)
                        .orElseThrow(() ->
                                new InvalidWagonAllocationException(
                                        "No active allocation found "
                                                + "for this wagon and consignment"));

        // -------------------------------------------------
        // 16. Create Unloading Record
        // -------------------------------------------------

        Unloading unloading = new Unloading();

        unloading.setWagon(wagon);
        unloading.setConsignment(consignment);

        unloading.setUnloadedQuantity(
                request.getUnloadedQuantity());

        unloading.setUnloadingTime(
                LocalDateTime.now());

        unloading.setUnloadingStatus(
                UnloadingStatus.UNLOADED);

        Unloading savedUnloading =
                unloadingRepository.save(unloading);

        // -------------------------------------------------
        // 17. Wagon Becomes EMPTY
        // -------------------------------------------------

        wagon.setStatus(WagonStatus.EMPTY);

        wagonRepository.save(wagon);

        // -------------------------------------------------
        // 18. Release Allocation
        // -------------------------------------------------

        allocation.setAllocationStatus(
                AllocationStatus.RELEASED);

        allocationRepository.save(allocation);

        // -------------------------------------------------
        // 19. Check Demand Completion
        // -------------------------------------------------

        Demand demand = consignment.getDemand();

        if (demand == null) {

            throw new DemandNotFoundException(
                    "Demand not found for consignment");
        }

        int requiredWagons = demand.getRequiredWagons();

        if (requiredWagons <= 0) {

            throw new InvalidWagonAllocationException(
                    "Required wagon count must be greater than zero");
        }

        long unloadedWagons =
                unloadingRepository.countByConsignment(
                        consignment);

        Double totalUnloadedQuantity =
                unloadingRepository.sumUnloadedQuantity(
                        consignment);

        if (totalUnloadedQuantity == null) {
            totalUnloadedQuantity = 0.0;
        }

        if (unloadedWagons >= requiredWagons &&
                totalUnloadedQuantity >= consignment.getQuantity()) {

            demand.setStatus(DemandStatus.DELIVERED);

            demandRepository.save(demand);
        }

        // -------------------------------------------------
        // 20. Return Unloading Record
        // -------------------------------------------------

        return savedUnloading;
    }

    // -------------------------------------------------
    // Release an empty wagon
    // -------------------------------------------------

    @Transactional
    public Wagon releaseWagon(Long wagonId) {

        // -------------------------------------------------
        // 1. Validate Wagon ID
        // -------------------------------------------------

        if (wagonId == null || wagonId <= 0) {

            throw new InvalidWagonAllocationException(
                    "Valid wagon ID is required");
        }

        // -------------------------------------------------
        // 2. Find Wagon
        // -------------------------------------------------

        Wagon wagon = wagonRepository.findById(wagonId)
                .orElseThrow(() ->
                        new WagonNotFoundException(
                                "Wagon not found with id: "
                                        + wagonId));

        // -------------------------------------------------
        // 3. Wagon Must Be EMPTY
        // -------------------------------------------------

        if (wagon.getStatus() != WagonStatus.EMPTY) {

            throw new InvalidWagonAllocationException(
                    "Only EMPTY wagons can be released");
        }

        // -------------------------------------------------
        // 4. Make Wagon AVAILABLE
        // -------------------------------------------------

        wagon.setStatus(WagonStatus.AVAILABLE);

        return wagonRepository.save(wagon);
    }

    // -------------------------------------------------
    // Get all unloading records
    // -------------------------------------------------

    public List<Unloading> getAllUnloadings() {

        return unloadingRepository.findAll();
    }
}