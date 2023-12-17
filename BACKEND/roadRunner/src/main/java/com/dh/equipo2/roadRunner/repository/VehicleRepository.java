package com.dh.equipo2.roadRunner.repository;

import com.dh.equipo2.roadRunner.domain.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> getByPlate(String plate);

    @Modifying
    @Transactional
    void deleteByPlate(String plate);

    @Query("select v from Vehicle v where v.category.title = :categoryTitle")
    List<Vehicle> getAllByCat(@Param("categoryTitle") String categoryTitle);

}
