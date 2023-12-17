package com.dh.equipo2.roadRunner.controller;

import com.dh.equipo2.roadRunner.dto.VehicleDto;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.service.VehicleService;
import com.dh.equipo2.roadRunner.util.PostResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/vehicles")
@Tag(name = "Vehicles")
@Slf4j
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @Autowired
    ObjectMapper mapper;


    @PostMapping(value = "/save", consumes = {"multipart/form-data", "application/octet-stream"})
    @Operation(summary = "Guardar un vehículo", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> saveVehicle(@RequestParam("vehicleDto") String vehicleDto,
                                              @RequestParam("imageFile") MultipartFile imageFile) throws JsonProcessingException, DuplicateNameException {
        VehicleDto value = mapper.readValue(vehicleDto, VehicleDto.class);
        return vehicleService.createVehicle(value,imageFile).map(ResponseEntity::ok)
                .orElse(ResponseEntity.internalServerError().build());

    }

    @GetMapping("/get/{plate}")
    @Operation(summary = "Consultar vehículo por placa")
    public ResponseEntity<VehicleDto> getByPlate(@PathVariable String plate) throws NotFoundNameException {
        return vehicleService.getByPlate(plate).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getall")
    @Operation(summary = "Mostrar todos los vehículos existentes")
    public ResponseEntity<List<VehicleDto>> getAll(
            @RequestParam(defaultValue = "0") Integer startPag,
            @RequestParam(defaultValue = "10") Integer vehicleXpag){
        return ResponseEntity.ok(vehicleService.findAll(startPag, vehicleXpag));
    }

    @GetMapping("/category/{title}")
    @Operation(summary = "Mostrar todos los vehículos por el nombre de su categoría")
    public ResponseEntity<List<VehicleDto>> getAllByCategoryTitle(@PathVariable String title) {
        return ResponseEntity.ok(vehicleService.findAllByCategory(title));
    }

    @PutMapping(value = "/update/{vehiclePlate}", consumes = {"multipart/form-data", "application/octet-stream"})
    @Operation(summary = "Actualizar vehículo por placa", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateByPlate(@PathVariable String vehiclePlate,
                                                @RequestParam("vehicleDto") String vehicleDto,
                                                @RequestParam("imageFile") MultipartFile imageFile) throws DuplicateNameException, NotFoundNameException, JsonProcessingException {
        VehicleDto value = mapper.readValue(vehicleDto, VehicleDto.class);
        return vehicleService.updateByPlate(vehiclePlate,value, imageFile).map(ResponseEntity::ok).orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/delete/{vehiclePlate}")
    @Operation(summary = "Eliminar vehículo por placa", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteByPlate(@PathVariable String vehiclePlate) throws NotFoundNameException {
        return vehicleService.deleteByPlate(vehiclePlate).map(ResponseEntity::ok).orElse(ResponseEntity.badRequest().build());
    }


}
