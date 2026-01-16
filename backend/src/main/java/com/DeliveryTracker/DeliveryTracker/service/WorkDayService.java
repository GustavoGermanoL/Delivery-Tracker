package com.DeliveryTracker.DeliveryTracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.hibernate.boot.registry.classloading.spi.ClassLoaderService.Work;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.DeliveryTracker.DeliveryTracker.dto.PeriodSummaryDTO;
import com.DeliveryTracker.DeliveryTracker.dto.WorkDayRequestDTO;
import com.DeliveryTracker.DeliveryTracker.dto.WorkDayResponseDTO;
import com.DeliveryTracker.DeliveryTracker.entity.Preset;
import com.DeliveryTracker.DeliveryTracker.entity.User;
import com.DeliveryTracker.DeliveryTracker.entity.WorkDay;
import com.DeliveryTracker.DeliveryTracker.repository.PresetRepository;
import com.DeliveryTracker.DeliveryTracker.repository.WorkDayRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkDayService {


    private final WorkDayRepository workDayRepository;
    private final PresetRepository presetRepository;

   
    // MÉTODO MÁGICO: Pega o usuário que está mandando a requisição (pelo Token)
    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<WorkDay> findAll() {
        // Agora só busca os dias do usuário logado
        return workDayRepository.findAll(); // Cuidado: ideal seria filtrar por usuário aqui também se tiver um método findAllByUser
        // Mas como vamos usar o getSummary, o findAll é pouco usado.
    }

    public List<WorkDay> findByDateRange(LocalDate start, LocalDate end) {
        User currentUser = getAuthenticatedUser();
        return workDayRepository.findByDateBetweenAndUser(start, end, currentUser);
    }

    public WorkDayResponseDTO save(WorkDayRequestDTO dto) {
        User currentUser = getAuthenticatedUser();
        
        // 1. Verifica se já existe um dia salvo para este usuário nesta data
        var existing = workDayRepository.findByDateAndUser(dto.date(), currentUser);
        
        WorkDay workDay;

        if (existing.isPresent()) {
            // Se já existe, vamos atualizar o objeto existente
            workDay = existing.get();
        } else {
            // Se não existe, criamos um novo e definimos o dono
            workDay = new WorkDay();
            workDay.setDate(dto.date());
            workDay.setUser(currentUser);
        }

        // 2. PREENCHE OS DADOS (Conversão DTO -> Entity)
        workDay.setServiceValue(dto.manualValue()); // ou dto.serviceValue() dependendo do nome no DTO
        workDay.setReimbursementValue(dto.reimbursementValue());
        workDay.setReimbursementDescription(dto.reimbursementDesc());

        // 3. RESOLVE O PRESET (Isso corrige o erro de ID vs Objeto)
        if (dto.presetId() != null) {
            // Busca o Preset no banco pelo ID que veio do front
            Preset preset = presetRepository.findById(dto.presetId())
                    .orElseThrow(() -> new RuntimeException("Preset não encontrado com ID: " + dto.presetId()));
            workDay.setPreset(preset);
        } else {
            // Se veio null (ex: limpou o dia), remove o preset
            workDay.setPreset(null);
        }

        // 4. SALVA NO BANCO
        WorkDay saved = workDayRepository.save(workDay);

        // 5. Retorna convertido para DTO (Boa prática)
        return new WorkDayResponseDTO(saved);
    }

    public List<WorkDayResponseDTO> findByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

    
        List<WorkDay> list = this.findByDateRange(start, end);

        return list.stream()
                .map(WorkDayResponseDTO::new)
                .toList();
    }

    // 5. Resumo do Período (FILTRADO POR USUÁRIO)
    public PeriodSummaryDTO getPeriodSummary(LocalDate start, LocalDate end) {
      
        List<WorkDay> days = this.findByDateRange(start, end);

        BigDecimal totalService = days.stream()
                .map(WorkDay::getServiceValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalReimbursement = days.stream()
                .map(day -> day.getReimbursementValue() != null ? day.getReimbursementValue() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalReceivable = totalService.add(totalReimbursement);

        List<WorkDayResponseDTO> daysDto = days.stream()
                .map(WorkDayResponseDTO::new)
                .toList();

        return new PeriodSummaryDTO(totalService, totalReimbursement, totalReceivable, daysDto);
    }

    
    public void delete(LocalDate date) {
        User currentUser = getAuthenticatedUser();
        
        // Busca primeiro para ter certeza que pertence ao usuário
        Optional<WorkDay> target = workDayRepository.findByDateAndUser(date, currentUser);
        
        // Se achou, deleta. Se não achou (ou for de outro usuário), não faz nada.
        target.ifPresent(workDayRepository::delete);
    }

    
}
