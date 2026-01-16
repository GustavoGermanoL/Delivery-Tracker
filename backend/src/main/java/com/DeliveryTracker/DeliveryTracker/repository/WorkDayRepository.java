package com.DeliveryTracker.DeliveryTracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.DeliveryTracker.DeliveryTracker.entity.User;
import com.DeliveryTracker.DeliveryTracker.entity.WorkDay;

@Repository
public interface WorkDayRepository extends JpaRepository<WorkDay, LocalDate> {
    Optional<WorkDay> findByDateAndUser(LocalDate date, User user);

    List<WorkDay> findByDateBetweenAndUser(LocalDate start, LocalDate end, User user);

}
