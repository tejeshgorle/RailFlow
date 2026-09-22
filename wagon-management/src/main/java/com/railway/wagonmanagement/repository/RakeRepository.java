package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Rake;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RakeRepository extends JpaRepository<Rake, Long> {

    boolean existsByConsignment(Consignment consignment);

    boolean existsByRakeNumberIgnoreCase(String rakeNumber);
}