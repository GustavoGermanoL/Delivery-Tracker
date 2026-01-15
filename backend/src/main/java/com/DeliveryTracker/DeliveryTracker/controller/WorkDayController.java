package com.DeliveryTracker.DeliveryTracker.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.DeliveryTracker.DeliveryTracker.dto.PeriodSummaryDTO;
import com.DeliveryTracker.DeliveryTracker.dto.WorkDayRequestDTO;
import com.DeliveryTracker.DeliveryTracker.dto.WorkDayResponseDTO;
import com.DeliveryTracker.DeliveryTracker.service.WorkDayService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.hibernate.jdbc.Work;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/work-days")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkDayController {

    private final WorkDayService service;

    @PostMapping
    public ResponseEntity<WorkDayResponseDTO> save(@RequestBody @Valid WorkDayRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }

    // GET: Buscar dias do mês (ex: /api/work-days?year=2025&month=11)
    @GetMapping
    public ResponseEntity<List<WorkDayResponseDTO>> getByMonth(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(service.findByMonth(year, month));
    }

    // GET /api/work-days/summary?start=2025-11-01&end=2025-11-15
    @GetMapping("/summary")
    public ResponseEntity<PeriodSummaryDTO> getSummary(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        
        return ResponseEntity.ok(service.getPeriodSummary(start, end));
    }
    
    // DELETE: Remover um dia (ex: /api/work-days/2025-11-05)
    @DeleteMapping("/{date}")
    public ResponseEntity<Void> delete(@PathVariable LocalDate date) {
        service.delete(date);
        return ResponseEntity.noContent().build();
    }

    
}
