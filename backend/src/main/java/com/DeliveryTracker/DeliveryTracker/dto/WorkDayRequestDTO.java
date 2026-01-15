package com.DeliveryTracker.DeliveryTracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record WorkDayRequestDTO( 

    @NotNull(message = "A data é obrigatória")
    LocalDate date,

    Long presetId,

    @PositiveOrZero(message = "O valor não pode ser negativo")
    BigDecimal manualValue,

    @PositiveOrZero
    BigDecimal reimbursementValue,
    
    String reimbursementDesc
) {}


