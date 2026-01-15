package com.DeliveryTracker.DeliveryTracker.dto;

import java.math.BigDecimal;

import com.DeliveryTracker.DeliveryTracker.entity.Preset;

public record PresetResponseDTO(
    Long id,
    String name,
    BigDecimal fixedValue,
    String colorHex

) 
{
    public PresetResponseDTO(Preset entity) {
        this(entity.getId(), entity.getName(), entity.getFixedValue(), entity.getColorHex());
    }
}
