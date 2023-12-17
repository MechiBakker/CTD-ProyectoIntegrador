package com.dh.equipo2.roadRunner.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "booking")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private LocalDate bookingInitialDate;

    @Column
    private LocalDate bookingFinalDate;

    @ManyToOne
    @JoinColumn(name = "idVehicle")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "idUser")
    private User user;

    @Column
    private Double bookingTotalValue;

    public Booking(LocalDate bookingInitialDate, LocalDate bookingFinalDate, Vehicle vehicle, User user) {
        this.bookingInitialDate = bookingInitialDate;
        this.bookingFinalDate = bookingFinalDate;
        this.vehicle = vehicle;
        this.user = user;
        this.bookingTotalValue = vehicle.getPricePerDay()* (ChronoUnit.DAYS.between(bookingInitialDate,bookingFinalDate)+1);
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", Fecha inicial reserva=" + bookingInitialDate +
                ", Fecha final reserva=" + bookingFinalDate +
                ", Placa vehiculo=" + vehicle.getPlate() +
                ", Email usuario=" + user.getEmail() +
                ", Total valor reserva=" + bookingTotalValue +
                '}';
    }

}
