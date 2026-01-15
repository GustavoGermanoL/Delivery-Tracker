package com.DeliveryTracker.DeliveryTracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.DeliveryTracker.DeliveryTracker.dto.PresetRequestDTO;
import com.DeliveryTracker.DeliveryTracker.dto.PresetResponseDTO;
import com.DeliveryTracker.DeliveryTracker.entity.Preset;
import com.DeliveryTracker.DeliveryTracker.repository.PresetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PresetService {

    private final PresetRepository repository;

    public List<PresetResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(PresetResponseDTO::new)
                .toList();
    }

    public PresetResponseDTO create(PresetRequestDTO dto) {
        Preset entity = new Preset();
        entity.setName(dto.name());
        entity.setFixedValue(dto.fixedValue());
        entity.setColorHex(dto.colorHex());
        
        Preset saved = repository.save(entity);
        return new PresetResponseDTO(saved);
    }
}
