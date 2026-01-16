package com.DeliveryTracker.DeliveryTracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.DeliveryTracker.DeliveryTracker.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}