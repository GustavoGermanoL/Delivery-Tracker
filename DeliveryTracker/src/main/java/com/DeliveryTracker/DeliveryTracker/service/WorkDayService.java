package com.DeliveryTracker.DeliveryTracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.hibernate.boot.registry.classloading.spi.ClassLoaderService.Work;
import org.springframework.stereotype.Service;

import com.DeliveryTracker.DeliveryTracker.dto.PeriodSummaryDTO;
import com.DeliveryTracker.DeliveryTracker.dto.WorkDayRequestDTO;
import com.DeliveryTracker.DeliveryTracker.dto.WorkDayResponseDTO;
import com.DeliveryTracker.DeliveryTracker.entity.Preset;
import com.DeliveryTracker.DeliveryTracker.entity.WorkDay;
import com.DeliveryTracker.DeliveryTracker.repository.PresetRepository;
import com.DeliveryTracker.DeliveryTracker.repository.WorkDayRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkDayService {


    private final WorkDayRepository workDayRepository;
    private final PresetRepository presetRepository;

    public WorkDayResponseDTO save(WorkDayRequestDTO dto) {
        WorkDay workDay = new WorkDay();
        workDay.setDate(dto.date());
        
        // --- Lógica de Valor: Preset vs Manual ---
        if (dto.presetId() != null) {
            // Cenário 1: Usuário clicou no botão colorido
            Preset preset = presetRepository.findById(dto.presetId())
                    .orElseThrow(() -> new RuntimeException("Preset não encontrado ID: " + dto.presetId()));
            
            workDay.setPreset(preset);
            workDay.setServiceValue(preset.getFixedValue()); // Pega o valor atrelado ao preset
        } else {
            // Cenário 2: Usuário digitou valor manual
            if (dto.manualValue() == null) {
                throw new RuntimeException("Se não selecionar um Preset, deve informar o valor manual.");
            }
            workDay.setPreset(null);
            workDay.setServiceValue(dto.manualValue());
        }

        // --- Lógica de Reembolso ---
        workDay.setReimbursementValue(dto.reimbursementValue());
        workDay.setReimbursementDescription(dto.reimbursementDesc());

        // Salva no banco (se já existir data, ele atualiza/sobrescreve)
        WorkDay saved = workDayRepository.save(workDay);

        return new WorkDayResponseDTO(saved);
    }

    public List<WorkDayResponseDTO> findByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth()); // Último dia do mês

        List<WorkDay> list = workDayRepository.findByDateBetween(start, end);

        // Converte a lista de Entidades para DTOs
        return list.stream()
                .map(WorkDayResponseDTO::new)
                .toList();
    }

    public PeriodSummaryDTO getPeriodSummary(LocalDate start, LocalDate end) {
        // 1. Busca os dias no intervalo (ex: 01 a 15)
        List<WorkDay> days = workDayRepository.findByDateBetween(start, end);

        // 2. Soma as Diárias (Service Value)
        BigDecimal totalService = days.stream()
                .map(WorkDay::getServiceValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Soma os Reembolsos (Tratando nulos para não dar erro)
        BigDecimal totalReimbursement = days.stream()
                .map(day -> day.getReimbursementValue() != null ? day.getReimbursementValue() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Calcula o Total Geral
        BigDecimal totalReceivable = totalService.add(totalReimbursement);

        // 5. Converte a lista de dias para DTO (para mostrar no extrato)
        List<WorkDayResponseDTO> daysDto = days.stream()
                .map(WorkDayResponseDTO::new)
                .toList();

        return new PeriodSummaryDTO(totalService, totalReimbursement, totalReceivable, daysDto);
    }

    
    // Método para deletar um dia (ex: clicou errado)
    public void delete(LocalDate date) {
        workDayRepository.deleteById(date);
    }

    
}
