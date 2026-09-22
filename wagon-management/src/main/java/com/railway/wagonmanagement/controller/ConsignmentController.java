package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.dto.ConsignmentFromDemandRequest;
import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.ConsignmentRequest;
import com.railway.wagonmanagement.service.ConsignmentService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consignments")
public class ConsignmentController {

    private final ConsignmentService consignmentService;

    public ConsignmentController(
            ConsignmentService consignmentService) {

        this.consignmentService = consignmentService;
    }

    @PostMapping
    public Consignment createConsignment(
            @Valid @RequestBody ConsignmentRequest request) {

        return consignmentService.createConsignment(request);
    }

    @GetMapping
    public List<Consignment> getAllConsignments() {
        return consignmentService.getAllConsignments();
    }

    @GetMapping("/{id}")
    public Consignment getConsignmentById(
            @PathVariable Long id) {

        return consignmentService.getConsignmentById(id);
    }

    @PostMapping("/from-demand")
    public Consignment createConsignmentFromDemand(
            @Valid @RequestBody ConsignmentFromDemandRequest request) {

        return consignmentService.createConsignmentFromDemand(request);
    }
}