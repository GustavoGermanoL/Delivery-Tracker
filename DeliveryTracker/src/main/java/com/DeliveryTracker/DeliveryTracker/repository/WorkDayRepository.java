package com.DeliveryTracker.DeliveryTracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.DeliveryTracker.DeliveryTracker.entity.WorkDay;

@Repository
public interface WorkDayRepository extends JpaRepository<WorkDay, LocalDate> {
    List<WorkDay> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
