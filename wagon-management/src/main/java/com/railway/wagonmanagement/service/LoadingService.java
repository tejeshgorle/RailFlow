package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.dto.LoadingRequest;
import com.railway.wagonmanagement.exception.ConsignmentNotFoundException;
import com.railway.wagonmanagement.exception.InvalidWagonAllocationException;
import com.railway.wagonmanagement.exception.WagonNotFoundException;
import com.railway.wagonmanagement.model.AllocationStatus;
import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Demand;
import com.railway.wagonmanagement.model.DemandStatus;
import com.railway.wagonmanagement.model.Loading;
import com.railway.wagonmanagement.model.LoadingStatus;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonStatus;
import com.railway.wagonmanagement.repository.ConsignmentRepository;
import com.railway.wagonmanagement.repository.DemandRepository;
import com.railway.wagonmanagement.repository.LoadingRepository;
import com.railway.wagonmanagement.repository.WagonAllocationRepository;
import com.railway.wagonmanagement.repository.WagonRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoadingService {

    private final LoadingRepository loadingRepository;
    private final WagonRepository wagonRepository;
    private final ConsignmentRepository consignmentRepository;
    private final WagonAllocationRepository allocationRepository;
    private final DemandRepository demandRepository;

    public LoadingService(
            LoadingRepository loadingRepository,
            WagonRepository wagonRepository,
            ConsignmentRepository consignmentRepository,
            WagonAllocationRepository allocationRepository,
            DemandRepository demandRepository) {

        this.loadingRepository = loadingRepository;
        this.wagonRepository = wagonRepository;
        this.consignmentRepository = consignmentRepository;
        this.allocationRepository = allocationRepository;
        this.demandRepository = demandRepository;
    }

    // -------------------------------------------------
    // Get all loading records
    // -------------------------------------------------

    public List<Loading> getAllLoadings() {

        return loadingRepository.findAll();
    }

    // -------------------------------------------------
    // Load a wagon
    // -------------------------------------------------

    @Transactional
    public Loading loadWagon(LoadingRequest request) {

        // -------------------------------------------------
        // 1. Validate Request
        // -------------------------------------------------

        if (request == null) {

            throw new InvalidWagonAllocationException(
                    "Loading request cannot be null");
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
        // 4. Validate Loaded Quantity
        // -------------------------------------------------

        if (request.getLoadedQuantity() == null ||
                request.getLoadedQuantity() <= 0) {

            throw new InvalidWagonAllocationException(
                    "Loaded quantity must be greater than zero");
        }

        // -------------------------------------------------
        // 5. Find Wagon
        // -------------------------------------------------

        Wagon wagon = wagonRepository.findById(request.getWagonId())
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
        // 7. Check Demand
        // -------------------------------------------------

        Demand demand = consignment.getDemand();

        if (demand == null) {

            throw new InvalidWagonAllocationException(
                    "Consignment is not associated with a demand");
        }

        // -------------------------------------------------
        // 8. Check Demand Status
        // -------------------------------------------------

        if (demand.getStatus() != DemandStatus.APPROVED &&
                demand.getStatus() != DemandStatus.WAGONS_ALLOCATED) {

            throw new InvalidWagonAllocationException(
                    "Wagons can only be loaded for an APPROVED "
                            + "or WAGONS_ALLOCATED demand");
        }

        // -------------------------------------------------
        // 9. Check Consignment Origin
        // -------------------------------------------------

        if (consignment.getFromStation() == null) {

            throw new InvalidWagonAllocationException(
                    "Consignment origin station is required");
        }

        // -------------------------------------------------
        // 10. Check Wagon Status
        // -------------------------------------------------

        if (wagon.getStatus() != WagonStatus.ALLOCATED) {

            throw new InvalidWagonAllocationException(
                    "Only ALLOCATED wagons can be loaded");
        }

        // -------------------------------------------------
        // 11. Check Wagon Current Station
        // -------------------------------------------------

        if (wagon.getStation() == null) {

            throw new InvalidWagonAllocationException(
                    "Wagon does not have a current station");
        }

        if (!wagon.getStation().getStationId()
                .equals(consignment.getFromStation().getStationId())) {

            throw new InvalidWagonAllocationException(
                    "Wagon is not currently at the "
                            + "consignment's origin station");
        }

        // -------------------------------------------------
        // 12. Verify Wagon Was Allocated
        //     To This Consignment
        // -------------------------------------------------

        boolean allocatedToConsignment =
                allocationRepository
                        .existsByWagonAndConsignmentAndAllocationStatus(
                                wagon,
                                consignment,
                                AllocationStatus.ALLOCATED);

        if (!allocatedToConsignment) {

            throw new InvalidWagonAllocationException(
                    "Wagon is not allocated to this consignment");
        }

        // -------------------------------------------------
        // 13. Prevent Duplicate Loading
        // -------------------------------------------------

        boolean alreadyLoaded =
                loadingRepository.existsByWagonAndConsignment(
                        wagon,
                        consignment);

        if (alreadyLoaded) {

            throw new InvalidWagonAllocationException(
                    "Wagon has already been loaded for this consignment");
        }

        // -------------------------------------------------
        // 14. Validate Consignment Quantity
        // -------------------------------------------------

        Double requiredQuantity =
                consignment.getQuantity();

        if (requiredQuantity == null ||
                requiredQuantity <= 0) {

            throw new InvalidWagonAllocationException(
                    "Consignment quantity must be greater than zero");
        }

        // -------------------------------------------------
        // 14A. Validate Wagon Capacity
        // -------------------------------------------------

        if (wagon.getCapacity() == null ||
                wagon.getCapacity() <= 0) {

        throw new InvalidWagonAllocationException(
                "Wagon capacity must be greater than zero");
        }

        if (request.getLoadedQuantity() > wagon.getCapacity()) {

        throw new InvalidWagonAllocationException(
                "Loaded quantity exceeds wagon capacity");
        }
        // -------------------------------------------------
        // 15. Calculate Already Loaded Quantity
        // -------------------------------------------------

        Double alreadyLoadedQuantity =
                loadingRepository.sumLoadedQuantity(
                        consignment,
                        LoadingStatus.LOADED);

        if (alreadyLoadedQuantity == null) {
            alreadyLoadedQuantity = 0.0;
        }

        // -------------------------------------------------
        // 16. Prevent Excess Loading
        // -------------------------------------------------

        Double newTotalQuantity =
                alreadyLoadedQuantity
                        + request.getLoadedQuantity();

        if (newTotalQuantity > requiredQuantity) {

            throw new InvalidWagonAllocationException(
                    "Loading this quantity exceeds the "
                            + "required consignment quantity");
        }

        // -------------------------------------------------
        // 17. Create Loading Record
        // -------------------------------------------------

        Loading loading = new Loading();

        loading.setWagon(wagon);
        loading.setConsignment(consignment);

        loading.setLoadedQuantity(
                request.getLoadedQuantity());

        loading.setLoadingTime(
                LocalDateTime.now());

        loading.setLoadingStatus(
                LoadingStatus.LOADED);

        Loading savedLoading =
                loadingRepository.save(loading);

        // -------------------------------------------------
        // 18. Update Wagon Status
        // -------------------------------------------------

        wagon.setStatus(WagonStatus.LOADED);

        wagonRepository.save(wagon);

        // -------------------------------------------------
        // 19. Count Loaded Wagons
        // -------------------------------------------------

        long loadedWagons =
                loadingRepository.countByConsignmentAndLoadingStatus(
                        consignment,
                        LoadingStatus.LOADED);

        // -------------------------------------------------
        // 20. Calculate Total Loaded Quantity
        // -------------------------------------------------

        Double loadedQuantity =
                loadingRepository.sumLoadedQuantity(
                        consignment,
                        LoadingStatus.LOADED);

        if (loadedQuantity == null) {
            loadedQuantity = 0.0;
        }

        // -------------------------------------------------
        // 21. Validate Required Wagon Count
        // -------------------------------------------------

        Integer requiredWagons =
                demand.getRequiredWagons();

        if (requiredWagons == null ||
                requiredWagons <= 0) {

            throw new InvalidWagonAllocationException(
                    "Required wagon count must be greater than zero");
        }

        // -------------------------------------------------
        // 22. Check Whether Loading Is Complete
        // -------------------------------------------------

        if (loadedWagons >= requiredWagons &&
                loadedQuantity >= requiredQuantity) {

            demand.setStatus(DemandStatus.LOADED);

            demandRepository.save(demand);
        }

        // -------------------------------------------------
        // 23. Return Saved Loading
        // -------------------------------------------------

        return savedLoading;
    }
}