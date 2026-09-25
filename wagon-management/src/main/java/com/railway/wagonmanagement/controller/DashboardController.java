package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.dto.DashboardResponse;
import com.railway.wagonmanagement.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        DashboardResponse response =
                dashboardService.getDashboard();

        return ResponseEntity.ok(response);
    }
}