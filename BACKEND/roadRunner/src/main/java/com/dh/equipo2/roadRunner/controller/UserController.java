package com.dh.equipo2.roadRunner.controller;
import com.dh.equipo2.roadRunner.dto.LoginDto;
import com.dh.equipo2.roadRunner.dto.UserDto;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.service.JwtService;
import com.dh.equipo2.roadRunner.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/users")
@Tag(name = "Users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/save")
    @Operation(summary = "Guardar un usuario")
    public ResponseEntity<String> saveUser(@RequestBody UserDto userDto) throws DuplicateNameException {

        ResponseEntity<String> response = null;
        Optional<String> message = userService.createUser(userDto);

        if (userDto!=null) {
            response = ResponseEntity.ok(message.get());
        } else {
            response = ResponseEntity.internalServerError().build();
        }
        return response;

    }

    @GetMapping("/getEmail/{email}")
    @Operation(summary = "Obtener usuario por email", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAnyAuthority('ADMIN', 'User')")
    public ResponseEntity<UserDto> getByEmail(@PathVariable String email) throws NotFoundNameException {
        return userService.getByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getAll")
    @Operation(summary = "Obtener todos los usuarios", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/getRole/{name}")
    @Operation(summary = "Mostrar todos los usuarios por el nombre de su rol", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllByRolName(@PathVariable String name) {
        return ResponseEntity.ok(userService.getAllByRolName(name));
    }

    @PutMapping("/update/{email}")
    @Operation(summary = "Actualizar un usuario por su email", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAnyAuthority('ADMIN', 'User')")
    public ResponseEntity<String> updateByEmail(@PathVariable String email, @RequestBody UserDto userDto) throws DuplicateNameException, NotFoundNameException {
        return userService.updateByEmail(email,userDto).map(ResponseEntity::ok).orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/delete/{email}")
    @Operation(summary = "Eliminar un usuario por su email", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAnyAuthority('ADMIN', 'User')")
    public ResponseEntity<String> deleteUserByEmail(@PathVariable String email) throws NotFoundNameException {
        return userService.deleteByEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/login")
    @Operation(summary = "validación de credenciales")
    public String authenticateAndGetToken(@RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail() , loginDto.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(loginDto.getEmail());
        } else {
            throw new UsernameNotFoundException("Usuario o contraseña no coinciden");
        }

    }

    @GetMapping("/confirmation/{token}")
    public ResponseEntity<String> confirmationUser(@PathVariable String token) throws DuplicateNameException, NotFoundNameException {
        return userService.confirmToken(token)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }


}
