package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.exception.ConsignmentNotFoundException;
import com.railway.wagonmanagement.exception.InvalidWagonAllocationException;
import com.railway.wagonmanagement.exception.WagonNotFoundException;
import com.railway.wagonmanagement.model.AllocationStatus;
import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Demand;
import com.railway.wagonmanagement.model.DemandStatus;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonAllocation;
import com.railway.wagonmanagement.model.WagonAllocationRequest;
import com.railway.wagonmanagement.model.WagonStatus;
import com.railway.wagonmanagement.repository.ConsignmentRepository;
import com.railway.wagonmanagement.repository.DemandRepository;
import com.railway.wagonmanagement.repository.WagonAllocationRepository;
import com.railway.wagonmanagement.repository.WagonRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WagonAllocationService {

    private final WagonAllocationRepository allocationRepository;
    private final WagonRepository wagonRepository;
    private final ConsignmentRepository consignmentRepository;
    private final DemandRepository demandRepository;

    public WagonAllocationService(
            WagonAllocationRepository allocationRepository,
            WagonRepository wagonRepository,
            ConsignmentRepository consignmentRepository,
            DemandRepository demandRepository) {

        this.allocationRepository = allocationRepository;
        this.wagonRepository = wagonRepository;
        this.consignmentRepository = consignmentRepository;
        this.demandRepository = demandRepository;
    }

    // -------------------------------------------------
    // Allocate Wagon
    // -------------------------------------------------

    @Transactional
    public WagonAllocation allocateWagon(
            WagonAllocationRequest request) {

        // -------------------------------------------------
        // 1. Validate request
        // -------------------------------------------------

        if (request == null) {

            throw new InvalidWagonAllocationException(
                    "Wagon allocation request cannot be null");
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
        // 4. Find Wagon
        // -------------------------------------------------

        Wagon wagon = wagonRepository.findById(request.getWagonId())
                .orElseThrow(() ->
                        new WagonNotFoundException(
                                "Wagon not found with id: "
                                        + request.getWagonId()));

        // -------------------------------------------------
        // 5. Find Consignment
        // -------------------------------------------------

        Consignment consignment =
                consignmentRepository
                        .findById(request.getConsignmentId())
                        .orElseThrow(() ->
                                new ConsignmentNotFoundException(
                                        "Consignment not found with id: "
                                                + request.getConsignmentId()));

        // -------------------------------------------------
        // 6. Get Demand associated with Consignment
        // -------------------------------------------------

        Demand demand = consignment.getDemand();

        if (demand == null) {

            throw new InvalidWagonAllocationException(
                    "Consignment is not associated with a demand");
        }

        // -------------------------------------------------
        // 7. Validate Demand Required Wagon Count
        // -------------------------------------------------

        Integer requiredWagons = demand.getRequiredWagons();

        if (requiredWagons == null ||
                requiredWagons <= 0) {

            throw new InvalidWagonAllocationException(
                    "Required wagon count must be greater than zero");
        }

        // -------------------------------------------------
        // 8. Demand must be APPROVED
        // -------------------------------------------------

        if (demand.getStatus() != DemandStatus.APPROVED) {

            throw new InvalidWagonAllocationException(
                    "Wagons can only be allocated for an APPROVED demand");
        }

        // -------------------------------------------------
        // 9. Validate Consignment Origin Station
        // -------------------------------------------------

        if (consignment.getFromStation() == null) {

            throw new InvalidWagonAllocationException(
                    "Consignment origin station is required");
        }

        // -------------------------------------------------
        // 10. Count Currently Allocated Wagons
        // -------------------------------------------------

        long allocatedWagons =
                allocationRepository
                        .countByConsignmentAndAllocationStatus(
                                consignment,
                                AllocationStatus.ALLOCATED);

        // -------------------------------------------------
        // 11. Check Required Wagon Limit
        // -------------------------------------------------

        if (allocatedWagons >= requiredWagons) {

            throw new InvalidWagonAllocationException(
                    "Required number of wagons has already been allocated");
        }

        // -------------------------------------------------
        // 12. Check Wagon Status
        // -------------------------------------------------

        if (wagon.getStatus() != WagonStatus.AVAILABLE) {

            throw new InvalidWagonAllocationException(
                    "Wagon is not available for allocation");
        }

        // -------------------------------------------------
        // 13. Check Wagon Current Station
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
        // 14. Check Whether Wagon Is Already Allocated
        // -------------------------------------------------

        if (allocationRepository
                .existsByWagonAndAllocationStatus(
                        wagon,
                        AllocationStatus.ALLOCATED)) {

            throw new InvalidWagonAllocationException(
                    "Wagon is already allocated");
        }

        // -------------------------------------------------
        // 15. Create Wagon Allocation
        // -------------------------------------------------

        WagonAllocation allocation =
                new WagonAllocation();

        allocation.setWagon(wagon);
        allocation.setConsignment(consignment);

        allocation.setAllocationStatus(
                AllocationStatus.ALLOCATED);

        allocation.setAllocatedAt(
                LocalDateTime.now());

        WagonAllocation savedAllocation =
                allocationRepository.save(allocation);

        // -------------------------------------------------
        // 16. Update Wagon Status
        // -------------------------------------------------

        wagon.setStatus(WagonStatus.ALLOCATED);

        wagonRepository.save(wagon);

        // -------------------------------------------------
        // 17. Count Wagons After Allocation
        // -------------------------------------------------

        allocatedWagons =
                allocationRepository
                        .countByConsignmentAndAllocationStatus(
                                consignment,
                                AllocationStatus.ALLOCATED);

        // -------------------------------------------------
        // 18. Update Demand Status
        // -------------------------------------------------

        if (allocatedWagons >= requiredWagons) {

            demand.setStatus(DemandStatus.WAGONS_ALLOCATED);

            demandRepository.save(demand);
        }

        // -------------------------------------------------
        // 19. Return Saved Allocation
        // -------------------------------------------------

        return savedAllocation;
    }

    // -------------------------------------------------
    // Get All Allocations
    // -------------------------------------------------

    public List<WagonAllocation> getAllAllocations() {

        return allocationRepository.findAll();
    }
}