package com.dh.equipo2.roadRunner.controller;

import com.dh.equipo2.roadRunner.domain.Booking;
import com.dh.equipo2.roadRunner.dto.BookingDto;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/bookings")
@Tag(name = "bookings")
@Slf4j
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN') || hasAuthority('User') ")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/")
    @Operation(summary = "guardar una reserva")
    public ResponseEntity<BookingDto> save(@RequestBody BookingDto bookingDto){
        return bookingService.createBooking(bookingDto)
                .map(ResponseEntity::ok)
                .orElseGet(ResponseEntity.internalServerError()::build);
    }

    @PostMapping("/calculate")
    @Operation(summary = "calcular una reserva")
    public ResponseEntity<BookingDto> calculate(@RequestBody BookingDto bookingDto){
        return bookingService.createBooking(bookingDto, false)
                .map(ResponseEntity::ok)
                .orElseGet(ResponseEntity.internalServerError()::build);
    }

    @GetMapping("/")
    @Operation(summary = "lista todas las reservas")
    public ResponseEntity<List<BookingDto>> getAll() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "listar reserva por su id")
    public ResponseEntity<BookingDto> getById(Long id) throws NotFoundNameException {
        return bookingService.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(ResponseEntity.notFound()::build);
    }

    @GetMapping("/vehicle/{plate}")
    @Operation(summary = "lista todas las reservas por placa de vehiculo")
    public ResponseEntity<List<BookingDto>> getAllByVehiclePlate(@PathVariable String plate) {
        return ResponseEntity.ok(bookingService.findAllByPlate(plate));
    }

    @GetMapping("/vehicle/dates/{plate}")
    @Operation(summary = "lista todas las fechas de reservas por placa de vehiculo")
    public ResponseEntity<List<String>> getBookingDateByVehiclePlate (@PathVariable String plate) {
        return ResponseEntity.ok(bookingService.getBookingDateByVehiclePlate(plate));
    }

    @GetMapping("/user/{email}")
    @Operation(summary = "lista todas las reservas por el email del usuario")
    public ResponseEntity<List<BookingDto>> getBookingDateByUserEmail(@PathVariable String email) {
        return ResponseEntity.ok(bookingService.getBookingDateByUserEmail(email));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "elimina una reserva por su id")
    public ResponseEntity<String> deleteById(Long id) throws NotFoundNameException {
        return bookingService.deleteById(id)
                .map(ResponseEntity::ok)
                .orElseGet(ResponseEntity.notFound()::build);
    }

    @PutMapping("/{id}")
    @Operation(summary = "actualiza una reserva mediante su id")
    public ResponseEntity<String> updateById(@PathVariable Long id,@RequestBody BookingDto bookingDto) throws NotFoundNameException{
        return bookingService.updateById(id, bookingDto)
                .map(ResponseEntity::ok)
                .orElseGet(ResponseEntity.notFound()::build);
    }

}
