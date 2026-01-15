package com.DeliveryTracker.DeliveryTracker.dto;

import java.math.BigDecimal;
import java.util.List;

public record PeriodSummaryDTO(
    BigDecimal totalService,       // Soma das suas diárias (Seu lucro)
    BigDecimal totalReimbursement, // Soma dos gastos (O que volta pra você)
    BigDecimal totalReceivable,    // O valor FINAL que cai na conta (Soma dos dois)
    List<WorkDayResponseDTO> days  // A lista detalhada para conferên// cia
) {}
