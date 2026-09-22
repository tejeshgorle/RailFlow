package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.model.WagonAllocation;
import com.railway.wagonmanagement.model.WagonAllocationRequest;
import com.railway.wagonmanagement.service.WagonAllocationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class WagonAllocationController {

    private final WagonAllocationService allocationService;

    public WagonAllocationController(
            WagonAllocationService allocationService) {

        this.allocationService = allocationService;
    }

    @PostMapping
    public WagonAllocation allocateWagon(
            @Valid @RequestBody WagonAllocationRequest request) {

        return allocationService.allocateWagon(request);
    }

    @GetMapping
    public List<WagonAllocation> getAllAllocations() {
        return allocationService.getAllAllocations();
    }
}