package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.dto.LoadingRequest;
import com.railway.wagonmanagement.model.Loading;
import com.railway.wagonmanagement.service.LoadingService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loadings")
public class LoadingController {

    private final LoadingService loadingService;

    public LoadingController(LoadingService loadingService) {
        this.loadingService = loadingService;
    }

    @PostMapping
    public Loading loadWagon(
            @Valid @RequestBody LoadingRequest request) {

        return loadingService.loadWagon(request);
    }

    @GetMapping
    public List<Loading> getAllLoadings() {

        return loadingService.getAllLoadings();
    }
}