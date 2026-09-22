package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.dto.ConsignmentFromDemandRequest;
import com.railway.wagonmanagement.exception.ConsignmentNotFoundException;
import com.railway.wagonmanagement.exception.CustomerNotFoundException;
import com.railway.wagonmanagement.exception.DemandNotFoundException;
import com.railway.wagonmanagement.exception.InvalidConsignmentException;
import com.railway.wagonmanagement.exception.InvalidDemandStatusException;
import com.railway.wagonmanagement.exception.StationNotFoundException;
import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.ConsignmentRequest;
import com.railway.wagonmanagement.model.Customer;
import com.railway.wagonmanagement.model.Demand;
import com.railway.wagonmanagement.model.DemandStatus;
import com.railway.wagonmanagement.model.Station;
import com.railway.wagonmanagement.repository.ConsignmentRepository;
import com.railway.wagonmanagement.repository.CustomerRepository;
import com.railway.wagonmanagement.repository.DemandRepository;
import com.railway.wagonmanagement.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsignmentService {

    private final ConsignmentRepository consignmentRepository;
    private final CustomerRepository customerRepository;
    private final StationRepository stationRepository;
    private final DemandRepository demandRepository;

    public ConsignmentService(
            ConsignmentRepository consignmentRepository,
            CustomerRepository customerRepository,
            StationRepository stationRepository,
            DemandRepository demandRepository) {

        this.consignmentRepository = consignmentRepository;
        this.customerRepository = customerRepository;
        this.stationRepository = stationRepository;
        this.demandRepository = demandRepository;
    }

    // =========================================================
    // CREATE CONSIGNMENT MANUALLY
    // =========================================================

    public Consignment createConsignment(
            ConsignmentRequest request) {

        Customer consignor =
                customerRepository.findById(request.getConsignorId())
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Consignor not found with id: "
                                                + request.getConsignorId()
                                )
                        );

        Customer consignee =
                customerRepository.findById(request.getConsigneeId())
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Consignee not found with id: "
                                                + request.getConsigneeId()
                                )
                        );

        Station fromStation =
                stationRepository.findById(request.getFromStationId())
                        .orElseThrow(() ->
                                new StationNotFoundException(
                                        "From station not found with id: "
                                                + request.getFromStationId()
                                )
                        );

        Station toStation =
                stationRepository.findById(request.getToStationId())
                        .orElseThrow(() ->
                                new StationNotFoundException(
                                        "To station not found with id: "
                                                + request.getToStationId()
                                )
                        );

        if (fromStation.getStationId().equals(toStation.getStationId())) {

        throw new InvalidConsignmentException(
                "From station and to station cannot be the same");
        }                

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

        throw new InvalidConsignmentException(
                "Consignment quantity must be greater than zero");
        }

        Consignment consignment = new Consignment();

        consignment.setConsignor(consignor);
        consignment.setConsignee(consignee);
        consignment.setCommodity(request.getCommodity());
        consignment.setQuantity(request.getQuantity());
        consignment.setFromStation(fromStation);
        consignment.setToStation(toStation);

        return consignmentRepository.save(consignment);
    }

    // =========================================================
    // GET ALL CONSIGNMENTS
    // =========================================================

    public List<Consignment> getAllConsignments() {

        return consignmentRepository.findAll();
    }

    // =========================================================
    // GET CONSIGNMENT BY ID
    // =========================================================

    public Consignment getConsignmentById(Long id) {

        return consignmentRepository.findById(id)
                .orElseThrow(() ->
                        new ConsignmentNotFoundException(
                                "Consignment not found with id: " + id
                        )
                );
    }

    // =========================================================
    // CREATE CONSIGNMENT FROM APPROVED DEMAND
    // =========================================================

    public Consignment createConsignmentFromDemand(
            ConsignmentFromDemandRequest request) {

        Demand demand =
                demandRepository.findById(request.getDemandId())
                        .orElseThrow(() ->
                                new DemandNotFoundException(
                                        "Demand not found with id: "
                                                + request.getDemandId()
                                )
                        );

        // Only APPROVED demand can be converted
        // into a consignment.
        if (demand.getStatus() != DemandStatus.APPROVED) {

            throw new InvalidDemandStatusException(
                    "Only APPROVED demands can be converted into a consignment"
            );
        }
        
        if (consignmentRepository.existsByDemand(demand)) {

        throw new InvalidConsignmentException(
                "A consignment already exists for demand id: "
                        + demand.getDemandId());
        }
        Customer consignee =
                customerRepository.findById(request.getConsigneeId())
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Consignee not found with id: "
                                                + request.getConsigneeId()
                                )
                        );

        Consignment consignment = new Consignment();

        // Link consignment to the demand
        consignment.setDemand(demand);

        // Customer who created the demand
        // becomes the consignor.
        consignment.setConsignor(demand.getCustomer());

        // Selected customer becomes consignee.
        consignment.setConsignee(consignee);

        // Copy demand information into consignment.
        consignment.setCommodity(demand.getCommodity());

        consignment.setQuantity(demand.getQuantity());

        consignment.setFromStation(demand.getFromStation());

        consignment.setToStation(demand.getToStation());

        return consignmentRepository.save(consignment);
    }
}