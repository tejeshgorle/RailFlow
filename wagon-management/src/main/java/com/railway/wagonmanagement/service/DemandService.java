package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.exception.CustomerNotFoundException;
import com.railway.wagonmanagement.exception.DemandNotFoundException;
import com.railway.wagonmanagement.exception.InvalidDemandException;
import com.railway.wagonmanagement.exception.InvalidDemandStatusException;
import com.railway.wagonmanagement.exception.StationNotFoundException;
import com.railway.wagonmanagement.model.Customer;
import com.railway.wagonmanagement.model.Demand;
import com.railway.wagonmanagement.model.DemandRequest;
import com.railway.wagonmanagement.model.DemandStatus;
import com.railway.wagonmanagement.model.Station;
import com.railway.wagonmanagement.repository.CustomerRepository;
import com.railway.wagonmanagement.repository.DemandRepository;
import com.railway.wagonmanagement.repository.StationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DemandService {

    private final DemandRepository demandRepository;
    private final CustomerRepository customerRepository;
    private final StationRepository stationRepository;

    public DemandService(
            DemandRepository demandRepository,
            CustomerRepository customerRepository,
            StationRepository stationRepository) {

        this.demandRepository = demandRepository;
        this.customerRepository = customerRepository;
        this.stationRepository = stationRepository;
    }

    @Transactional
    public Demand createDemand(DemandRequest request) {

        // 1. Check request object
        if (request == null) {
            throw new InvalidDemandException(
                    "Demand request cannot be null"
            );
        }

        // 2. Validate customer ID
        if (request.getCustomerId() == null ||
                request.getCustomerId() <= 0) {

            throw new InvalidDemandException(
                    "Valid customer ID is required"
            );
        }

        // 3. Validate from station ID
        if (request.getFromStationId() == null ||
                request.getFromStationId() <= 0) {

            throw new InvalidDemandException(
                    "Valid from station ID is required"
            );
        }

        // 4. Validate to station ID
        if (request.getToStationId() == null ||
                request.getToStationId() <= 0) {

            throw new InvalidDemandException(
                    "Valid to station ID is required"
            );
        }

        // 5. Validate commodity
        if (request.getCommodity() == null ||
                request.getCommodity().trim().isEmpty()) {

            throw new InvalidDemandException(
                    "Commodity is required"
            );
        }

        String commodity = request.getCommodity().trim();

        if (commodity.length() > 100) {
            throw new InvalidDemandException(
                    "Commodity cannot exceed 100 characters"
            );
        }

        // 6. Validate quantity
        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new InvalidDemandException(
                    "Demand quantity must be greater than zero"
            );
        }

        // 7. Validate required wagon count
        if (request.getRequiredWagons() == null ||
                request.getRequiredWagons() <= 0) {

            throw new InvalidDemandException(
                    "Required wagon count must be greater than zero"
            );
        }

        // 8. Find customer
        Customer customer =
                customerRepository.findById(request.getCustomerId())
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Customer not found with id: "
                                                + request.getCustomerId()
                                )
                        );

        // 9. Find from station
        Station fromStation =
                stationRepository.findById(request.getFromStationId())
                        .orElseThrow(() ->
                                new StationNotFoundException(
                                        "From station not found with id: "
                                                + request.getFromStationId()
                                )
                        );

        // 10. Find to station
        Station toStation =
                stationRepository.findById(request.getToStationId())
                        .orElseThrow(() ->
                                new StationNotFoundException(
                                        "To station not found with id: "
                                                + request.getToStationId()
                                )
                        );

        // 11. Same station check
        if (fromStation.getStationId()
                .equals(toStation.getStationId())) {

            throw new InvalidDemandException(
                    "From station and to station cannot be the same"
            );
        }

        // 12. Create demand
        Demand demand = new Demand();

        demand.setCustomer(customer);
        demand.setCommodity(commodity);
        demand.setQuantity(request.getQuantity());
        demand.setRequiredWagons(request.getRequiredWagons());
        demand.setFromStation(fromStation);
        demand.setToStation(toStation);

        // New demand starts in REGISTERED state
        demand.setStatus(DemandStatus.REGISTERED);

        // Record creation time
        demand.setDemandDate(LocalDateTime.now());

        return demandRepository.save(demand);
    }

    public List<Demand> getAllDemands() {
        return demandRepository.findAll();
    }

    public Demand getDemandById(Long demandId) {

        // Validate demand ID
        if (demandId == null || demandId <= 0) {
                throw new InvalidDemandException(
                        "Valid demand ID is required"
                );
        }

        // Find demand
        return demandRepository.findById(demandId)
                .orElseThrow(() ->
                        new DemandNotFoundException(
                                "Demand not found with id: " + demandId
                        )
                );
        }

    public Demand approveDemand(Long demandId) {

        // 13. Validate demand ID
        if (demandId == null || demandId <= 0) {
            throw new InvalidDemandException(
                    "Valid demand ID is required"
            );
        }

        // 14. Find demand
        Demand demand = demandRepository.findById(demandId)
                .orElseThrow(() ->
                        new DemandNotFoundException(
                                "Demand not found with id: " + demandId
                        )
                );

        // 15. Check current demand status
        if (demand.getStatus() != DemandStatus.REGISTERED) {

            throw new InvalidDemandStatusException(
                    "Only REGISTERED demands can be approved"
            );
        }

        // 16. Change demand status
        demand.setStatus(DemandStatus.APPROVED);

        return demandRepository.save(demand);
    }
}