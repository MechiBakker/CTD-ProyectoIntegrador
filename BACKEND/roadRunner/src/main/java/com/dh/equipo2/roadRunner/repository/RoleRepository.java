package com.dh.equipo2.roadRunner.repository;

import com.dh.equipo2.roadRunner.domain.Category;
import com.dh.equipo2.roadRunner.domain.Role;
import com.dh.equipo2.roadRunner.domain.User;
import com.dh.equipo2.roadRunner.domain.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{

    Optional<Role> getByName(String name);

    @Modifying
    @Transactional
    void deleteByName(String name);

}
