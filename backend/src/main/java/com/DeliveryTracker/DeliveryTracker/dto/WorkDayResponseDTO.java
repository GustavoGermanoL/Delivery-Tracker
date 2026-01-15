package com.DeliveryTracker.DeliveryTracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.DeliveryTracker.DeliveryTracker.entity.WorkDay;

public record WorkDayResponseDTO(

    LocalDate date,
    BigDecimal serviceValue,
    BigDecimal reimbursementValue,
    String reimbursementDescription,
    BigDecimal totalDayValue, //service + reimbursement
    Long presetId,
    String presetColor
){ 
    // Construtor utilitário para converter Entity -> DTO
    public WorkDayResponseDTO(WorkDay entity) {
        this(
            entity.getDate(),
            entity.getServiceValue(),
            entity.getReimbursementValue() != null ? entity.getReimbursementValue() : BigDecimal.ZERO,
            entity.getReimbursementDescription(),
            // Calculando total
            entity.getServiceValue().add(
                entity.getReimbursementValue() != null ? entity.getReimbursementValue() : BigDecimal.ZERO
            ),
            entity.getPreset() != null ? entity.getPreset().getId() : null,
            entity.getPreset() != null ? entity.getPreset().getColorHex() : "#FFFFFF" // Branco se não tiver preset
        );
    }
}
