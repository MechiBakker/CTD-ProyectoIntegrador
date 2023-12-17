package com.dh.equipo2.roadRunner.repository;

import com.dh.equipo2.roadRunner.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Override
    <S extends Booking> S save(S entity);

    Optional<Booking> findById(Long id);

    @Query("SELECT b FROM Booking b WHERE b.vehicle.plate = :plate")
    List<Booking> findAllByVehiclePlate(@Param("plate") String plate);

    @Query("SELECT b FROM Booking b WHERE b.user.email = :email")
    List<Booking> findAllByEmail(@Param("email") String email);

    @Modifying
    @Transactional
    void deleteById(Long id);

}
