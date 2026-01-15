package com.DeliveryTracker.DeliveryTracker.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record PresetRequestDTO(

    @NotBlank(message = "O nome é obrigatório")
    String name,

    @NotNull(message = "O valor é obrigatório")
    @PositiveOrZero(message = "O valor não pode ser negativo")
    BigDecimal fixedValue,

    @NotBlank(message = "A cor é obrigatória")
    String colorHex

) {}
