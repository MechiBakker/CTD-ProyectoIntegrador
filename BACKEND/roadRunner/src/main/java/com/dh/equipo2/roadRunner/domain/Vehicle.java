package com.dh.equipo2.roadRunner.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table (name = "vehicle")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column (unique = true)
    private String plate;

    @Column
    private String brand;

    @Column
    private String model;

    @Column
    private String color;

    @Column
    private String imageUrl;

    @Column
    private Boolean available;

    @Column
    private Integer passengerCapacity;

    @Column
    private Integer doorCount;

    @Column
    private Integer luggageCapacity;

    @Column
    private Boolean automaticTransmission;

    @Column
    private Double pricePerDay;

    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_vehicle_id")
    private Category category;

    public Vehicle(String plate, String brand, String model, String color, String imageUrl, Boolean available, Integer passengerCapacity, Integer doorCount, Integer luggageCapacity, Boolean automaticTransmission, Double pricePerDay, Category category, String description) {
        this.plate = plate;
        this.brand = brand;
        this.model = model;
        this.color = color;
        this.imageUrl = imageUrl;
        this.available = available;
        this.passengerCapacity = passengerCapacity;
        this.doorCount = doorCount;
        this.luggageCapacity = luggageCapacity;
        this.automaticTransmission = automaticTransmission;
        this.pricePerDay = pricePerDay;
        this.category = category;
        this.description = description;

    }

}
