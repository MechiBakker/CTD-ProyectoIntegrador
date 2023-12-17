package com.dh.equipo2.roadRunner.dto;

import com.dh.equipo2.roadRunner.domain.Category;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class VehicleDto {

    private String plate;
    private String brand;
    private String model;
    private String color;
    private String imageUrl;
    private Boolean available;
    private Integer passengerCapacity;
    private Integer doorCount;
    private Integer luggageCapacity;
    private Boolean automaticTransmission;
    private Double pricePerDay;
    private String nameCategory;
    private String description;

}
