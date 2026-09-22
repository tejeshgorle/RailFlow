package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.dto.UnloadingRequest;
import com.railway.wagonmanagement.model.Unloading;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.service.UnloadingService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unloadings")
public class UnloadingController {

    private final UnloadingService unloadingService;

    public UnloadingController(UnloadingService unloadingService) {
        this.unloadingService = unloadingService;
    }

    @PostMapping
    public Unloading unloadWagon(
            @Valid @RequestBody UnloadingRequest request) {

        return unloadingService.unloadWagon(request);
    }

    @GetMapping
    public List<Unloading> getAllUnloadings() {
        return unloadingService.getAllUnloadings();
    }

    @PutMapping("/release/{wagonId}")
    public Wagon releaseWagon(@PathVariable Long wagonId) {
        return unloadingService.releaseWagon(wagonId);
    }
}