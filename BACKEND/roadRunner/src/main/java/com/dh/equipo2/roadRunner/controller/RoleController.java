package com.dh.equipo2.roadRunner.controller;


import com.dh.equipo2.roadRunner.dto.CategoryDto;
import com.dh.equipo2.roadRunner.dto.RoleDto;
import com.dh.equipo2.roadRunner.dto.UserDto;
import com.dh.equipo2.roadRunner.exceptions.CategoryException;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.service.RoleService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/roles")
@Tag(name = "Roles")
@Slf4j
public class RoleController {
    @Autowired
    private RoleService roleService;

    @Autowired
    ObjectMapper mapper;
    @PostMapping("/save")
    @Operation(summary = "Guardar un rol", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> saveRole(@RequestBody RoleDto roleDto) throws DuplicateNameException {
        ResponseEntity<String> response = null;
        Optional<String> message = roleService.createRole(roleDto);

        if (roleDto!=null) {
            response = ResponseEntity.ok(message.get());
        } else {
            response = ResponseEntity.internalServerError().build();
        }
        return response;
    }

    @GetMapping("/get/{name}")
    @Operation(summary = "Obtener detalle de un rol por nombre", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<RoleDto> getRoleByName (@PathVariable String name) throws NotFoundNameException{
        return roleService.getByNameRole(name).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{name}")
    @Operation(summary = "Actualizar un Rol por nombre", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateRoleByName (@PathVariable String name, @RequestBody RoleDto roleDto) throws CategoryException, DuplicateNameException, NotFoundNameException {

        return roleService.updateRoleByName(name, roleDto).map(ResponseEntity::ok).orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/getAll")
    @Operation(summary = "Obtener todos los Roles", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RoleDto>> getAllRoles() {

        ResponseEntity<List<RoleDto>> listResponseEntity = null;
        listResponseEntity = ResponseEntity.ok(roleService.findAll());

        return listResponseEntity;
    }

    @DeleteMapping("/delete/{name}")
    @Operation(summary = "Eliminar un Rol por su nombre", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteRoleByName(@PathVariable String name) throws NotFoundNameException, CategoryException {
        return roleService.deleteByNameRole(name)
                .map(ResponseEntity::ok).orElse(ResponseEntity.badRequest().build());
    }

}
