package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {

    boolean existsByCustomerNameIgnoreCase(String customerName);
}