package com.dh.equipo2.roadRunner.service;

import com.dh.equipo2.roadRunner.domain.Booking;
import com.dh.equipo2.roadRunner.domain.User;
import com.dh.equipo2.roadRunner.domain.Vehicle;
import com.dh.equipo2.roadRunner.dto.BookingDto;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.repository.BookingRepository;
import com.dh.equipo2.roadRunner.repository.UserRepository;
import com.dh.equipo2.roadRunner.repository.VehicleRepository;
import com.dh.equipo2.roadRunner.util.Util;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<BookingDto> createBooking(BookingDto bookingDto){
        return createBooking(bookingDto, true);
    }

    public Optional<BookingDto> createBooking(BookingDto bookingDto, Boolean save){
        if (bookingDto != null){
            Vehicle vehicle = vehicleRepository.getByPlate(bookingDto.getPlateVehicle()).get();
            User user = userRepository.getByEmail(bookingDto.getEmailUser()).get();
            Booking booking = new Booking(bookingDto.getBookingInitialDate(), bookingDto.getBookingFinalDate(), vehicle, user);

            if(save) {
                bookingRepository.save(booking);
                log.info("Su reserva ha sido realizada con exito!");
            }

            bookingDto = new BookingDto(booking.getId(), booking.getBookingInitialDate(), booking.getBookingFinalDate(),booking.getVehicle().getPlate(),booking.getUser().getEmail(), booking.getBookingTotalValue());
        }

        return Optional.ofNullable(bookingDto);
    }

    public List<BookingDto> findAll(){
        List<BookingDto> bookingDtoList = new ArrayList<>();
        List<Booking> bookings = bookingRepository.findAll();
        for (Booking booking: bookings){
            BookingDto bookingDto = new BookingDto(booking.getId(), booking.getBookingInitialDate(), booking.getBookingFinalDate(),booking.getVehicle().getPlate(),booking.getUser().getEmail(), booking.getBookingTotalValue());
            bookingDtoList.add(bookingDto);
        }
        return bookingDtoList;
    }

    public List<BookingDto> findAllByPlate(String plate){
        List<BookingDto> bookingDtoList = new ArrayList<>();
        List<Booking> Bookings = bookingRepository.findAllByVehiclePlate(plate);
        for (Booking booking: Bookings){
            BookingDto bookingDto = new BookingDto(booking.getId(), booking.getBookingInitialDate(), booking.getBookingFinalDate(),booking.getVehicle().getPlate(),booking.getUser().getEmail(), booking.getBookingTotalValue());
            bookingDtoList.add(bookingDto);
        }
        return bookingDtoList;
    }
    public List<String> getBookingDateByVehiclePlate(String plate){
        List<String> dates = new ArrayList<>();
        List<BookingDto> bookingDtoList = this.findAllByPlate(plate);
        for (BookingDto bookingDto: bookingDtoList){
            LocalDate initialDate = bookingDto.getBookingInitialDate();
            LocalDate finalDate = bookingDto.getBookingFinalDate();
            List<String> dateRange = Util.getArraydates(initialDate, finalDate);
            dates.addAll(dateRange);
        }
        return dates;
    }

    public List<BookingDto> getBookingDateByUserEmail(String email){
        List<BookingDto> bookingDtoList = new ArrayList<>();
        List<Booking> bookings = bookingRepository.findAllByEmail(email);
        for (Booking booking: bookings){
            BookingDto bookingDto = new BookingDto(booking.getId(), booking.getBookingInitialDate(), booking.getBookingFinalDate(),booking.getVehicle().getPlate(),booking.getUser().getEmail(), booking.getBookingTotalValue());
            bookingDtoList.add(bookingDto);
        }
        return bookingDtoList;
    }

    public Optional<BookingDto> getById(Long id) throws NotFoundNameException {
        BookingDto bookingDto = null;
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isEmpty()){
            log.error("No existe una reserva con id: " + id);
            throw new NotFoundNameException("No existe una reserva con id: " + id);
        }
        Booking booking = optionalBooking.get();
        bookingDto = new BookingDto(booking.getBookingInitialDate(), booking.getBookingFinalDate(), booking.getVehicle().getPlate(), booking.getUser().getEmail());
        return Optional.ofNullable(bookingDto);
    }

    public Optional<String> deleteById(Long id) throws NotFoundNameException {
        String mensaje = null;
        Optional<BookingDto> optionalBookingDto = this.getById(id);
        if (optionalBookingDto.isPresent()){
            bookingRepository.deleteById(id);
            mensaje = "Se ha eliminado exitosamente la reserva con id: " + id;
            log.info(mensaje);
        }
        return Optional.ofNullable(mensaje);
    }

    public Optional<String>updateById(Long id, BookingDto bookingDto) throws NotFoundNameException {
        String mensaje = null;
        this.deleteById(id);
        this.createBooking(bookingDto);
        mensaje = "La reserva fue actualizada exitosamente!";
        log.info(mensaje);
        return Optional.ofNullable(mensaje);
    }

}
