package com.dh.equipo2.roadRunner.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingDto {

    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate bookingInitialDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate bookingFinalDate;
    private String plateVehicle;
    private String emailUser;
    private Double bookingTotalValue;

    public BookingDto(LocalDate bookingInitialDate, LocalDate bookingFinalDate, String plateVehicle, String emailUser) {
        this.bookingInitialDate = bookingInitialDate;
        this.bookingFinalDate = bookingFinalDate;
        this.plateVehicle = plateVehicle;
        this.emailUser = emailUser;
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", bookingInitialDate=" + bookingInitialDate +
                ", bookingFinalDate=" + bookingFinalDate +
                ", plateVehicle='" + plateVehicle + '\'' +
                ", emailUser='" + emailUser + '\'' +
                ", bookingTotalValue=" + bookingTotalValue +
                '}';
    }

}
