package com.DeliveryTracker.DeliveryTracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.DeliveryTracker.DeliveryTracker.dto.PresetRequestDTO;
import com.DeliveryTracker.DeliveryTracker.dto.PresetResponseDTO;
import com.DeliveryTracker.DeliveryTracker.service.PresetService;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/presets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PresetController {

    private final PresetService service;

    @GetMapping
    public ResponseEntity<List<PresetResponseDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<PresetResponseDTO> create(@RequestBody @Valid PresetRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }
}
