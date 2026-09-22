package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.dto.RakeDetailsResponse;
import com.railway.wagonmanagement.dto.RakeRequest;
import com.railway.wagonmanagement.model.Rake;
import com.railway.wagonmanagement.service.RakeService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rakes")
public class RakeController {

    private final RakeService rakeService;

    public RakeController(RakeService rakeService) {
        this.rakeService = rakeService;
    }

    // -------------------------------------------------
    // Form Rake
    // -------------------------------------------------

    @PostMapping
    public Rake formRake(
            @Valid @RequestBody RakeRequest request) {

        return rakeService.formRake(request);
    }

    // -------------------------------------------------
    // Get All Rakes
    // -------------------------------------------------

    @GetMapping
    public List<Rake> getAllRakes() {

        return rakeService.getAllRakes();
    }

    // -------------------------------------------------
    // Get Rake Details
    // -------------------------------------------------

    @GetMapping("/{id}")
    public RakeDetailsResponse getRakeDetails(
            @PathVariable Long id) {

        return rakeService.getRakeDetails(id);
    }

    // -------------------------------------------------
    // Dispatch Rake
    // -------------------------------------------------

    @PutMapping("/{id}/dispatch")
    public Rake dispatchRake(
            @PathVariable Long id) {

        return rakeService.dispatchRake(id);
    }

    // -------------------------------------------------
    // Arrive Rake
    // -------------------------------------------------

    @PutMapping("/{id}/arrive")
    public Rake arriveRake(
            @PathVariable Long id) {

        return rakeService.arriveRake(id);
    }
}