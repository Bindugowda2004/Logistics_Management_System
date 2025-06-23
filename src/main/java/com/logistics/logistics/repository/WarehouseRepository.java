package com.logistics.logistics.repository;

import com.logistics.logistics.model.Warehouse;
import com.logistics.logistics.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Integer> {
    List<Warehouse> findByManager(User manager);
    List<Warehouse> findByIsActive(Boolean isActive);
    Optional<Warehouse> findByName(String name);
    List<Warehouse> findByLocationContaining(String locationKeyword);
}
