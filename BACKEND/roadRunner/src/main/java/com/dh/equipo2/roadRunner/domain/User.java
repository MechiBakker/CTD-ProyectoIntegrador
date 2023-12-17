package com.dh.equipo2.roadRunner.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table (name = "user")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private String firstName;
    @Column
     private String lastName;

    @Column  (unique = true)
    private String documentId;

    @Column
    private String phoneNumber;

    @Column (unique = true)
    private String email;

    @Column
    private String password;

    @ManyToOne
    @JoinColumn(name = "user_role_id")
    private Role role;

    @OneToMany(mappedBy = "user")
    private Set<ConfirmationTokenEmail> tokens = new HashSet<>();

    @Column
    private Boolean enabled = false;

    public User(String firstName, String lastName, String documentId, String phoneNumber, String email, String password, Role role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.documentId = documentId;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.role = role;
    }

}
