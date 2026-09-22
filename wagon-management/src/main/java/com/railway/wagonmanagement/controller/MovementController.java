package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.model.Movement;
import com.railway.wagonmanagement.model.MovementRequest;
import com.railway.wagonmanagement.service.MovementService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movements")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping
    public Movement createMovement(@Valid @RequestBody MovementRequest request) {
        return movementService.createMovement(
                request.getWagonId(),
                request.getFromStationId(),
                request.getToStationId()
        );
    }
    @GetMapping
    public List<Movement> getAllMovements() {
        return movementService.getAllMovements();
    }
}