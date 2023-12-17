package com.dh.equipo2.roadRunner.service;

import com.dh.equipo2.roadRunner.domain.Vehicle;
import com.dh.equipo2.roadRunner.dto.VehicleDto;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.repository.CategoryRepository;
import com.dh.equipo2.roadRunner.repository.VehicleRepository;
import com.dh.equipo2.roadRunner.util.PostResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class VehicleService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ImageService imageService;

    public Optional<String> createVehicle(VehicleDto vehicleDto, MultipartFile multipartFile) throws DuplicateNameException {
        String message = null;

        if (vehicleDto != null){
            if (vehicleRepository.getByPlate(vehicleDto.getPlate()).isPresent()){
                log.error("El vehículo con placa: " + vehicleDto.getPlate() + " ya existe");
                throw new DuplicateNameException("El vehículo con placa: " + vehicleDto.getPlate() + " ya existe");
            }

            imageService.uploadImage(vehicleDto.getImageUrl(), multipartFile);
            Vehicle vehicle = mapper.convertValue(vehicleDto, Vehicle.class);
            vehicle.setImageUrl(imageService.getUrlImage(vehicleDto.getImageUrl()));
            vehicle.setCategory(categoryRepository.getByTitle(vehicleDto.getNameCategory()).get());
            vehicleRepository.save(vehicle);
            message = "Se a creado con exito el nuevo vehículo de placa: " + vehicleDto.getPlate();
            log.info(message);
        }
        return Optional.ofNullable(message);
    }

    public List<VehicleDto> findAll(int startPag, int vehicleXpag){

        Pageable pag = PageRequest.of(startPag, vehicleXpag);
        Page<Vehicle> pagResult = vehicleRepository.findAll(pag);
        if (pagResult.hasContent()) {
            return pagResult.getContent().stream().map(vehicle -> {
                    VehicleDto vehicleDto = mapper.convertValue(vehicle, VehicleDto.class);
                    vehicleDto.setNameCategory(vehicle.getCategory().getTitle());
                    return vehicleDto;
                    })
                    .collect(Collectors.collectingAndThen(Collectors.toList(), results -> {
                        Collections.shuffle(results);
                        return results;
                    }));
        } else {
            return Collections.emptyList();
        }
    }

    public List<VehicleDto> findAllByCategory(String title) {

        List<VehicleDto> vehiclesDtoList = new ArrayList<>();

        List<Vehicle> vehiclesList = vehicleRepository.getAllByCat(title);

        for (Vehicle vehicle : vehiclesList) {
            VehicleDto vehicleDto = mapper.convertValue(vehicle, VehicleDto.class);
            vehicleDto.setNameCategory(vehicle.getCategory().getTitle());
            vehiclesDtoList.add(vehicleDto);

        }
        return vehiclesDtoList;
    }

    public Optional<VehicleDto> getByPlate(String plate) throws NotFoundNameException {

        VehicleDto vehicleDto = null;

        Optional<Vehicle> optionalVehicle = vehicleRepository.getByPlate(plate);

        if (optionalVehicle.isEmpty()) {
            log.error("Lo siento, pero no contamos con un vehículo de placa: " + plate);
            throw new NotFoundNameException("Lo siento, pero no contamos con un vehículo de placa: " + plate);
        }
        vehicleDto = mapper.convertValue(optionalVehicle.get(), VehicleDto.class);
        vehicleDto.setNameCategory(optionalVehicle.get().getCategory().getTitle());
        return Optional.ofNullable(vehicleDto);
    }

    public Optional<String> deleteByPlate(String plate) throws NotFoundNameException {

        String message = null;

        Optional<VehicleDto> optionalVehicleDto = this.getByPlate(plate);

        if (optionalVehicleDto.isPresent()){
            vehicleRepository.deleteByPlate(plate);
            message = "Se ha eliminado exitosamente el vehículo con placa: " + plate;
            log.info(message);
        }
        return Optional.ofNullable(message);
    }


    public Optional<String> updateByPlate(String plate, VehicleDto vehicleDto, MultipartFile imageFile) throws NotFoundNameException, DuplicateNameException {

        String message = null;

        this.deleteByPlate(plate);
        this.createVehicle(vehicleDto, imageFile);
        message = "Actualización correcta del vehículo con placa: " + plate;
        log.info(message);
        return Optional.ofNullable(message);
    }

}
