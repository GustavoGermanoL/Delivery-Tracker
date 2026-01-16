package com.DeliveryTracker.DeliveryTracker.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_work_days")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkDay {

    @Id
    @Column(nullable = false, unique = true)
    private LocalDate date;

    // Valor do meu serviço - Isso vem do Preset Colorido
    @Column(name = "service_value")
    private BigDecimal serviceValue;

    @Column(name = "reimbursement_value")
    private BigDecimal reimbursementValue;

    @Column(name = "reimbursement_description")
    private String reimbursementDescription;

    @ManyToOne
    @JoinColumn(name = "preset_id")
    private Preset preset;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Isso evita que, ao buscar um dia, ele tente trazer o usuário inteiro junto (loop infinito)
    private User user;
    
    public BigDecimal getTotalReceivable() {
        return serviceValue.add(
            reimbursementValue != null ? reimbursementValue : BigDecimal.ZERO
        );
    }
}
