package com.DeliveryTracker.DeliveryTracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.DeliveryTracker.DeliveryTracker.entity.Preset;

@Repository
public interface PresetRepository extends JpaRepository<Preset, Long>{

}
