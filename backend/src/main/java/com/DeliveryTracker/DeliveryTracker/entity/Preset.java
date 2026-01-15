package com.DeliveryTracker.DeliveryTracker.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_presets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Preset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ex: "Rota Padrão", "Extra Domingo"

    @Column(name = "fixed_value", nullable = false)
    private BigDecimal fixedValue; // Ex: 80.00

    @Column(name = "color_hex", length = 7)
    private String colorHex; // Ex: "#00FF00" (Para o Frontend pintar o botão/célula)
}
