package com.railway.wagonmanagement.controller;

import org.springframework.web.bind.annotation.RestController;

import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.service.WagonService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController 
public class WagonController {

    private final WagonService wagonService;

    public WagonController(WagonService wagonService){
        this.wagonService = wagonService;
    }

    @GetMapping("/api/hello")
    public String hello(){
        return "Welcome to Wagon Management System";
    }
    @GetMapping("/api/wagons")
    public List<Wagon> getWagons(){
        return wagonService.getAllWagons();
    }

    @GetMapping("/api/wagons/{id}")
    public Wagon getWagonById(@PathVariable Long id) {
        return wagonService.getWagonById(id);
    }

    @PostMapping("/api/wagons")
    public Wagon createWagon(@Valid @RequestBody Wagon wagon) {
        return wagonService.createWagon(wagon);
    }
    @PutMapping("/api/wagons/{id}")
    public Wagon updateWagon(@PathVariable Long id, @Valid @RequestBody Wagon wagon) {
        return wagonService.updateWagon(id, wagon);
    }

    @DeleteMapping("/api/wagons/{id}")
    public String deleteWagon(@PathVariable Long id) {
        wagonService.deleteWagon(id);
        return "Wagon deleted successfully";
    }
}

