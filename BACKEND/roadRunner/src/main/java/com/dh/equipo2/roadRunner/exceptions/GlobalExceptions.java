package com.dh.equipo2.roadRunner.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptions {

    @ExceptionHandler({DuplicateNameException.class})
    public ResponseEntity<ErrorMessage> duplicatePlate (DuplicateNameException e) {
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage("Ops, algo salió mal");
        errorMessage.setDescription(e.getMessage());
        errorMessage.setStatusCode(1100);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler({NotFoundNameException.class})
    public ResponseEntity<ErrorMessage> NotFoundPlate (NotFoundNameException e) {
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage("Ops, algo salió mal");
        errorMessage.setDescription(e.getMessage());
        errorMessage.setStatusCode(1200);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler({CategoryException.class})
    public ResponseEntity<ErrorMessage> procesarCategoriaAsdignada(CategoryException e){
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage("Ops, algo salió mal");
        errorMessage.setDescription(e.getMessage());
        errorMessage.setStatusCode(1300);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler({UsernameNotFoundException.class})
    public ResponseEntity<ErrorMessage> errorCredenciales(UsernameNotFoundException e){
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage("Ops, algo salió mal");
        errorMessage.setDescription(e.getMessage());
        errorMessage.setStatusCode(1400);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler({IllegalStateException.class})
    public ResponseEntity<ErrorMessage> errorEnvioCorreo(IllegalStateException e){
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage("Ops, algo salió mal");
        errorMessage.setDescription(e.getMessage());
        errorMessage.setStatusCode(1500);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

}
