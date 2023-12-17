package com.dh.equipo2.roadRunner.service;
import com.dh.equipo2.roadRunner.domain.Category;
import com.dh.equipo2.roadRunner.domain.Role;
import com.dh.equipo2.roadRunner.domain.User;
import com.dh.equipo2.roadRunner.domain.Vehicle;
import com.dh.equipo2.roadRunner.dto.CategoryDto;
import com.dh.equipo2.roadRunner.dto.RoleDto;
import com.dh.equipo2.roadRunner.exceptions.CategoryException;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.repository.RoleRepository;
import com.dh.equipo2.roadRunner.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper mapper;

    @Transactional
    public Optional<String> createRole (RoleDto roleDto) throws DuplicateNameException {

        String message = null;

        if (roleDto != null) {
            if (roleRepository.getByName(roleDto.getName()).isPresent()) {
                log.error("El rol con nombre " + roleDto.getName() + " ya existe");
                throw new DuplicateNameException("El rol con nombre " + roleDto.getName() + " ya existe");
            }

            Role role = mapper.convertValue(roleDto, Role.class);
            roleRepository.save(role);
            message = "Se ha creado con éxito el nuevo rol: " + role.getName();
            log.info(message);
        }
        return Optional.ofNullable(message);
    }

    public Optional<RoleDto> getByNameRole(String nameRole) throws NotFoundNameException {

        Optional<Role> optionalRole = roleRepository.getByName(nameRole);

        if (optionalRole.isEmpty()) {
            throw new NotFoundNameException("No se encontró ningún Rol con el nombre: " + nameRole);
        }

        RoleDto roleDto = mapper.convertValue(optionalRole.get(), RoleDto.class);
        return Optional.ofNullable(roleDto);
    }

    public Optional<String> deleteByNameRole(String nameRole) throws NotFoundNameException, CategoryException {

        String message = null;

        Optional<RoleDto> optionalRoleDto = this.getByNameRole(nameRole);

        if (optionalRoleDto.isPresent()){
            List<User> users = userRepository.getAllByRol(nameRole);
            if (users.size()>=1){
                log.error("No se puede eliminar el rol porque tiene " + users.size() + " usuarios asignados");
                throw new CategoryException("No se puede eliminar el rol porque tiene " + users.size() + " usuarios asignados");
            }
            roleRepository.deleteByName(nameRole);
            message = "El rol: " + nameRole + " fue eliminado exitosamente";
            log.info(message);
        }
        return Optional.ofNullable(message);
    }

    @Transactional
    public Optional<String> updateRoleByName(String nameRole, RoleDto roleDto) throws NotFoundNameException, CategoryException, DuplicateNameException {

        String message = null;

        this.deleteByNameRole(nameRole);
        this.createRole(roleDto);
        message = "El rol, " + nameRole + " fue actualizado exitosamente";
        log.info(message);
        return Optional.ofNullable(message);
    }

    @Transactional(readOnly = true)
    public List<RoleDto> findAll(){

        List<RoleDto> roleDtoList = new ArrayList<>();
        List<Role> roleList = roleRepository.findAll();

        for (Role role:roleList){
            roleDtoList.add(mapper.convertValue(role, RoleDto.class));
        }

        return roleDtoList;
    }

}
