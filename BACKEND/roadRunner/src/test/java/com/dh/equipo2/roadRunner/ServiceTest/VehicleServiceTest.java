package com.dh.equipo2.roadRunner.ServiceTest;
import com.dh.equipo2.roadRunner.domain.Vehicle;
import com.dh.equipo2.roadRunner.dto.VehicleDto;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.repository.VehicleRepository;
import com.dh.equipo2.roadRunner.service.ImageService;
import com.dh.equipo2.roadRunner.service.VehicleService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    void createVehicle_WithValidData_ReturnsMessage() throws DuplicateNameException {

        VehicleDto vehicleDto = new VehicleDto();
        vehicleDto.setPlate("ABC123");
        vehicleDto.setImageUrl("image.png");

        MockMultipartFile multipartFile = new MockMultipartFile("image", "image.png", "image/png", new byte[0]);

        when(vehicleRepository.getByPlate(vehicleDto.getPlate())).thenReturn(Optional.empty());
        doNothing().when(imageService).uploadImage(vehicleDto.getImageUrl(), multipartFile);
        when(imageService.getUrlImage(vehicleDto.getImageUrl())).thenReturn("https://example.com/image.png");


        Optional<String> result = vehicleService.createVehicle(vehicleDto, multipartFile);


        assertTrue(result.isPresent());
        assertEquals("Se ha creado con éxito el nuevo vehículo", result.get());
        verify(vehicleRepository, times(1)).getByPlate(vehicleDto.getPlate());
        verify(imageService, times(1)).uploadImage(vehicleDto.getImageUrl(), multipartFile);
        verify(imageService, times(1)).getUrlImage(vehicleDto.getImageUrl());
        verify(vehicleRepository, times(1)).save(any(Vehicle.class));

        assertDoesNotThrow(() -> vehicleService.createVehicle(vehicleDto, multipartFile));
    }

    @Test
    void createVehicle_WithDuplicatePlate_ThrowsDuplicateNameException() throws DuplicateNameException {

        VehicleDto vehicleDto = new VehicleDto();
        vehicleDto.setPlate("ABC123");
        vehicleDto.setImageUrl("image.png");

        MockMultipartFile multipartFile = new MockMultipartFile("image", "image.png", "image/png", new byte[0]);

        when(vehicleRepository.getByPlate(vehicleDto.getPlate())).thenReturn(Optional.of(new Vehicle()));


        assertThrows(DuplicateNameException.class, () -> vehicleService.createVehicle(vehicleDto, multipartFile));
        verify(vehicleRepository, times(1)).getByPlate(vehicleDto.getPlate());

    }
}
