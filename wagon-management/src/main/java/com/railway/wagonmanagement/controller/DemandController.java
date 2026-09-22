package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.model.Demand;
import com.railway.wagonmanagement.model.DemandRequest;
import com.railway.wagonmanagement.service.DemandService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demands")
public class DemandController {

    private final DemandService demandService;

    public DemandController(DemandService demandService) {
        this.demandService = demandService;
    }

    @PostMapping
    public Demand createDemand(
            @RequestBody DemandRequest request) {

        return demandService.createDemand(request);
    }

    @GetMapping
    public List<Demand> getAllDemands() {
        return demandService.getAllDemands();
    }

    @GetMapping("/{id}")
    public Demand getDemandById(
            @PathVariable Long id) {

        return demandService.getDemandById(id);
    }

    @PutMapping("/{id}/approve")
    public Demand approveDemand(
            @PathVariable Long id) {

        return demandService.approveDemand(id);
    }
}