package com.dh.equipo2.roadRunner.repository;
import com.dh.equipo2.roadRunner.domain.User;
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
public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> getByEmail(String email);

    @Modifying
    @Transactional
    void deleteByEmail(String email);

    @Query("select u from User u where u.role.name = :roleName")
    List<User> getAllByRol(@Param("roleName") String roleName);

    @Modifying
    @Transactional
    @Query("UPDATE User u " +
            "SET u.enabled = true WHERE u.email = ?1")
    int enableUser(String email);

}
