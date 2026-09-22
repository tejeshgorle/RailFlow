package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.dto.RakeDetailsResponse;
import com.railway.wagonmanagement.dto.RakeRequest;
import com.railway.wagonmanagement.exception.ConsignmentNotFoundException;
import com.railway.wagonmanagement.exception.InvalidRakeException;
import com.railway.wagonmanagement.exception.RakeNotFoundException;
import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Demand;
import com.railway.wagonmanagement.model.DemandStatus;
import com.railway.wagonmanagement.model.LoadingStatus;
import com.railway.wagonmanagement.model.Rake;
import com.railway.wagonmanagement.model.RakeStatus;
import com.railway.wagonmanagement.model.RakeWagon;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonStatus;
import com.railway.wagonmanagement.repository.ConsignmentRepository;
import com.railway.wagonmanagement.repository.LoadingRepository;
import com.railway.wagonmanagement.repository.RakeRepository;
import com.railway.wagonmanagement.repository.RakeWagonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RakeService {

    private final RakeRepository rakeRepository;
    private final RakeWagonRepository rakeWagonRepository;
    private final ConsignmentRepository consignmentRepository;
    private final LoadingRepository loadingRepository;
    private final MovementService movementService;

    public RakeService(
                RakeRepository rakeRepository,
                RakeWagonRepository rakeWagonRepository,
                ConsignmentRepository consignmentRepository,
                LoadingRepository loadingRepository,
                MovementService movementService) {

        this.rakeRepository = rakeRepository;
        this.rakeWagonRepository = rakeWagonRepository;
        this.consignmentRepository = consignmentRepository;
        this.loadingRepository = loadingRepository;
        this.movementService = movementService;
        }

    // -------------------------------------------------
    // Form Rake
    // -------------------------------------------------

    @Transactional
    public Rake formRake(RakeRequest request) {

        // -------------------------------------------------
        // 1. Validate Request
        // -------------------------------------------------

        if (request == null) {
            throw new InvalidRakeException(
                    "Rake request cannot be null");
        }

        // -------------------------------------------------
        // 2. Validate Consignment ID
        // -------------------------------------------------

        if (request.getConsignmentId() == null ||
                request.getConsignmentId() <= 0) {

            throw new InvalidRakeException(
                    "Valid consignment ID is required");
        }

        // -------------------------------------------------
        // 3. Validate Rake Number
        // -------------------------------------------------

        if (request.getRakeNumber() == null ||
                request.getRakeNumber().trim().isEmpty()) {

            throw new InvalidRakeException(
                    "Rake number is required");
        }

        String rakeNumber =
                request.getRakeNumber().trim();

        if (rakeNumber.length() < 3 ||
                rakeNumber.length() > 30) {

            throw new InvalidRakeException(
                    "Rake number must be between 3 and 30 characters");
        }

        // -------------------------------------------------
        // 4. Find Consignment
        // -------------------------------------------------

        Consignment consignment =
                consignmentRepository.findById(
                        request.getConsignmentId())
                        .orElseThrow(() ->
                                new ConsignmentNotFoundException(
                                        "Consignment not found with id: "
                                                + request.getConsignmentId()));

        // -------------------------------------------------
        // 5. Find Associated Demand
        // -------------------------------------------------

        Demand demand = consignment.getDemand();

        if (demand == null) {

            throw new InvalidRakeException(
                    "Consignment is not associated with a demand");
        }

        // -------------------------------------------------
        // 6. Demand Must Be LOADED
        // -------------------------------------------------

        if (demand.getStatus() != DemandStatus.LOADED) {

            throw new InvalidRakeException(
                    "Rake can only be formed after loading is complete");
        }

        // -------------------------------------------------
        // 7. Validate Consignment Stations
        // -------------------------------------------------

        if (consignment.getFromStation() == null) {

            throw new InvalidRakeException(
                    "Consignment origin station is required");
        }

        if (consignment.getToStation() == null) {

            throw new InvalidRakeException(
                    "Consignment destination station is required");
        }

        if (consignment.getFromStation().getStationId()
                .equals(consignment.getToStation().getStationId())) {

            throw new InvalidRakeException(
                    "Consignment origin and destination "
                            + "cannot be the same");
        }

        // -------------------------------------------------
        // 8. Prevent Duplicate Rake for Consignment
        // -------------------------------------------------

        if (rakeRepository.existsByConsignment(consignment)) {

            throw new InvalidRakeException(
                    "A rake has already been formed for this consignment");
        }

        // -------------------------------------------------
        // 9. Find Loaded Wagons
        // -------------------------------------------------

        List<Wagon> loadedWagons =
                loadingRepository.findLoadedWagons(
                        consignment,
                        LoadingStatus.LOADED);

        // -------------------------------------------------
        // 10. Validate Required Wagon Count
        // -------------------------------------------------

        Integer requiredWagons =
                demand.getRequiredWagons();

        if (requiredWagons == null ||
                requiredWagons <= 0) {

            throw new InvalidRakeException(
                    "Required wagon count must be greater than zero");
        }

        // -------------------------------------------------
        // 11. Check Exact Loaded Wagon Count
        // -------------------------------------------------

        if (loadedWagons.size() != requiredWagons) {

            throw new InvalidRakeException(
                    "Required " + requiredWagons
                            + " wagons, but "
                            + loadedWagons.size()
                            + " loaded wagons were found");
        }

        // -------------------------------------------------
        // 12. Validate Loaded Wagons
        // -------------------------------------------------

        for (Wagon wagon : loadedWagons) {

            // Wagon must still be LOADED
            if (wagon.getStatus() != WagonStatus.LOADED) {

                throw new InvalidRakeException(
                        "All wagons in the rake must be in LOADED status");
            }

            // Wagon must have a station
            if (wagon.getStation() == null) {

                throw new InvalidRakeException(
                        "A loaded wagon does not have a current station");
            }

            // Wagon must be at origin station
            if (!wagon.getStation().getStationId()
                    .equals(consignment.getFromStation().getStationId())) {

                throw new InvalidRakeException(
                        "A loaded wagon is not at the "
                                + "consignment's origin station");
            }
        }

        // -------------------------------------------------
        // 13. Check Rake Number
        // -------------------------------------------------

        if (rakeRepository.existsByRakeNumberIgnoreCase(rakeNumber)) {

            throw new InvalidRakeException(
                    "Rake number already exists: " + rakeNumber);
        }

        // -------------------------------------------------
        // 14. Create Rake
        // -------------------------------------------------

        Rake rake = new Rake();

        rake.setRakeNumber(rakeNumber);
        rake.setConsignment(consignment);
        rake.setFromStation(consignment.getFromStation());
        rake.setToStation(consignment.getToStation());
        rake.setWagonCount(requiredWagons);
        rake.setFormationTime(LocalDateTime.now());

        // Rake starts in FORMED state
        rake.setStatus(RakeStatus.FORMED);

        Rake savedRake =
                rakeRepository.save(rake);

        // -------------------------------------------------
        // 15. Add Wagons to Rake
        // -------------------------------------------------

        int sequenceNumber = 1;

        for (Wagon wagon : loadedWagons) {

            RakeWagon rakeWagon =
                    new RakeWagon();

            rakeWagon.setRake(savedRake);
            rakeWagon.setWagon(wagon);
            rakeWagon.setSequenceNumber(sequenceNumber);

            rakeWagonRepository.save(rakeWagon);

            sequenceNumber++;
        }

        return savedRake;
    }

    // -------------------------------------------------
    // Dispatch Rake
    // -------------------------------------------------

    @Transactional
    public Rake dispatchRake(Long rakeId) {

        // -------------------------------------------------
        // 1. Validate Rake ID
        // -------------------------------------------------

        if (rakeId == null || rakeId <= 0) {

            throw new InvalidRakeException(
                    "Valid rake ID is required");
        }

        // -------------------------------------------------
        // 2. Find Rake
        // -------------------------------------------------

        Rake rake =
                rakeRepository.findById(rakeId)
                        .orElseThrow(() ->
                                new RakeNotFoundException(
                                        "Rake not found with id: "
                                                + rakeId));

        // -------------------------------------------------
        // 3. Only FORMED Rakes Can Be Dispatched
        // -------------------------------------------------

        if (rake.getStatus() != RakeStatus.FORMED) {

            throw new InvalidRakeException(
                    "Only FORMED rakes can be dispatched");
        }

        // -------------------------------------------------
        // 4. Validate Rake Stations
        // -------------------------------------------------

        if (rake.getFromStation() == null ||
                rake.getToStation() == null) {

            throw new InvalidRakeException(
                    "Rake origin and destination stations are required");
        }

        // -------------------------------------------------
        // 5. Set Dispatch Information
        // -------------------------------------------------

        rake.setDispatchTime(LocalDateTime.now());

        rake.setStatus(RakeStatus.DISPATCHED);

        return rakeRepository.save(rake);
    }

    // -------------------------------------------------
    // Arrive Rake
    // -------------------------------------------------

    @Transactional
    public Rake arriveRake(Long rakeId) {

        // -------------------------------------------------
        // 1. Validate Rake ID
        // -------------------------------------------------

        if (rakeId == null || rakeId <= 0) {

            throw new InvalidRakeException(
                    "Valid rake ID is required");
        }

        // -------------------------------------------------
        // 2. Find Rake
        // -------------------------------------------------

        Rake rake =
                rakeRepository.findById(rakeId)
                        .orElseThrow(() ->
                                new RakeNotFoundException(
                                        "Rake not found with id: "
                                                + rakeId));

        // -------------------------------------------------
        // 3. Only DISPATCHED Rakes Can Arrive
        // -------------------------------------------------

        if (rake.getStatus() != RakeStatus.DISPATCHED) {

            throw new InvalidRakeException(
                    "Only DISPATCHED rakes can arrive");
        }

        // -------------------------------------------------
        // 4. Validate Destination
        // -------------------------------------------------

        if (rake.getToStation() == null) {

            throw new InvalidRakeException(
                    "Rake destination station is required");
        }

        // -------------------------------------------------
        // 5. Find Rake Wagons
        // -------------------------------------------------

        List<RakeWagon> rakeWagons =
                rakeWagonRepository.findByRake(rake);

        if (rakeWagons.isEmpty()) {

            throw new InvalidRakeException(
                    "Rake does not contain any wagons");
        }

        // -------------------------------------------------
        // 6. Move Every Wagon to Destination
        // -------------------------------------------------

        LocalDateTime arrivalTime = LocalDateTime.now();

        for (RakeWagon rakeWagon : rakeWagons) {

        Wagon wagon = rakeWagon.getWagon();

        if (wagon == null) {
                throw new InvalidRakeException(
                        "Rake contains an invalid wagon");
        }

        movementService.recordRakeMovement(
                wagon,
                rake.getFromStation(),
                rake.getToStation(),
                arrivalTime
        );
        }

        // -------------------------------------------------
        // 7. Change Rake Status
        // -------------------------------------------------

        rake.setStatus(RakeStatus.ARRIVED);

        return rakeRepository.save(rake);
    }

    // -------------------------------------------------
    // Get All Rakes
    // -------------------------------------------------

    public List<Rake> getAllRakes() {

        return rakeRepository.findAll();
    }

    public Rake getRakeById(Long rakeId) {

        if (rakeId == null || rakeId <= 0) {
                throw new InvalidRakeException(
                        "Valid rake ID is required"
                );
        }

        return rakeRepository.findById(rakeId)
                .orElseThrow(() ->
                        new RakeNotFoundException(
                                "Rake not found with id: " + rakeId
                        )
                );
        }

    // -------------------------------------------------
        // Get Rake Details
        // -------------------------------------------------

        public RakeDetailsResponse getRakeDetails(Long rakeId) {

        // 1. Validate Rake ID
        if (rakeId == null || rakeId <= 0) {
                throw new InvalidRakeException(
                        "Valid rake ID is required");
        }

        // 2. Find Rake
        Rake rake =
                rakeRepository.findById(rakeId)
                        .orElseThrow(() ->
                                new RakeNotFoundException(
                                        "Rake not found with id: "
                                                + rakeId));

        // 3. Get Rake Wagons
        List<RakeWagon> rakeWagons =
                rakeWagonRepository.findByRake(rake);

        // 4. Convert wagon records to DTOs
        List<RakeDetailsResponse.WagonSummary> wagonDetails =
                new ArrayList<>();

        for (RakeWagon rakeWagon : rakeWagons) {

                Wagon wagon = rakeWagon.getWagon();

                if (wagon == null) {
                continue;
                }

                wagonDetails.add(
                        new RakeDetailsResponse.WagonSummary(
                                rakeWagon.getSequenceNumber(),
                                wagon.getWagonId(),
                                wagon.getWagonNumber(),
                                wagon.getWagonType(),
                                wagon.getCapacity(),
                                wagon.getStatus() != null
                                        ? wagon.getStatus().name()
                                        : null
                        )
                );
        }

        // 5. Station Details
        RakeDetailsResponse.StationSummary fromStation = null;

        if (rake.getFromStation() != null) {

                fromStation =
                        new RakeDetailsResponse.StationSummary(
                                rake.getFromStation().getStationId(),
                                rake.getFromStation().getStationCode(),
                                rake.getFromStation().getStationName(),
                                rake.getFromStation().getZone(),
                                rake.getFromStation().getDivision()
                        );
        }

        RakeDetailsResponse.StationSummary toStation = null;

        if (rake.getToStation() != null) {

                toStation =
                        new RakeDetailsResponse.StationSummary(
                                rake.getToStation().getStationId(),
                                rake.getToStation().getStationCode(),
                                rake.getToStation().getStationName(),
                                rake.getToStation().getZone(),
                                rake.getToStation().getDivision()
                        );
        }

        // 6. Consignment Details
        RakeDetailsResponse.ConsignmentSummary consignmentDetails = null;

        Consignment consignment = rake.getConsignment();

        if (consignment != null) {

                Long demandId = null;

                if (consignment.getDemand() != null) {
                demandId = consignment.getDemand().getDemandId();
                }

                Long consignorId = null;
                String consignorName = null;

                if (consignment.getConsignor() != null) {
                consignorId =
                        consignment.getConsignor().getCustomerId();

                consignorName =
                        consignment.getConsignor().getCustomerName();
                }

                Long consigneeId = null;
                String consigneeName = null;

                if (consignment.getConsignee() != null) {
                consigneeId =
                        consignment.getConsignee().getCustomerId();

                consigneeName =
                        consignment.getConsignee().getCustomerName();
                }

                consignmentDetails =
                        new RakeDetailsResponse.ConsignmentSummary(
                                consignment.getConsignmentId(),
                                consignment.getCommodity(),
                                consignment.getQuantity(),
                                demandId,
                                consignorId,
                                consignorName,
                                consigneeId,
                                consigneeName
                        );
        }

        // 7. Build final response
        return new RakeDetailsResponse(
                rake.getRakeId(),
                rake.getRakeNumber(),
                rake.getStatus() != null
                        ? rake.getStatus().name()
                        : null,
                rake.getWagonCount(),
                rake.getFormationTime(),
                rake.getDispatchTime(),
                fromStation,
                toStation,
                consignmentDetails,
                wagonDetails
        );
        }    
}