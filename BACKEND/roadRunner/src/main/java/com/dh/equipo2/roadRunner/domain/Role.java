package com.dh.equipo2.roadRunner.domain;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table (name = "role")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column (unique = true)
    private String name;

    @Column
    private String description;

    @OneToMany(mappedBy = "role")
    private Set<User> users = new HashSet<>();

    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

}
