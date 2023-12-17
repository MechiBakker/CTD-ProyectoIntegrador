package com.dh.equipo2.roadRunner.controller;



import com.dh.equipo2.roadRunner.dto.CategoryDto;
import com.dh.equipo2.roadRunner.dto.VehicleDto;
import com.dh.equipo2.roadRunner.exceptions.CategoryException;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.service.CategoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/categories")
@Tag(name = "Categories")
@Slf4j
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    ObjectMapper mapper;

    @PostMapping(value = "/create", consumes = {"multipart/form-data", "application/octet-stream"})
    @Operation(summary = "Crear una Categoría", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> createCat(@RequestParam("categoryDto") String categoryDto,
                                            @RequestParam("imageFile") MultipartFile imageFile) throws DuplicateNameException, JsonProcessingException {
        CategoryDto value = mapper.readValue(categoryDto, CategoryDto.class);
        return categoryService.createCat(value,imageFile).map(ResponseEntity::ok)
                .orElse(ResponseEntity.internalServerError().build());

    }

    @GetMapping("/get/{titleCategory}")
    @Operation(summary = "Consultar categoría por su nombre")
    public ResponseEntity<CategoryDto> getByTitle (@PathVariable String titleCategory) throws NotFoundNameException{
        return categoryService.getByNameCat(titleCategory).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }


    @PutMapping(value = "/update/{titleCategory}", consumes = {"multipart/form-data", "application/octet-stream"})
    @Operation(summary = "Actualizar una Categoría por su nombre", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateCat(@PathVariable String titleCategory, @RequestParam("categoryDto") String categoryDto, @RequestParam("imgFile") MultipartFile file) throws JsonProcessingException, CategoryException, DuplicateNameException, NotFoundNameException {
        CategoryDto categoryDtoTransform = mapper.readValue(categoryDto, CategoryDto.class);
        return categoryService.updateByTitle(titleCategory, categoryDtoTransform, file)
                .map(ResponseEntity::ok).orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/getAll")
    @Operation(summary = "Obtener todas las Categorías")
    public ResponseEntity<List<CategoryDto>> getAll(){
        ResponseEntity<List<CategoryDto>> listResponseEntity = null;
        listResponseEntity = ResponseEntity.ok(categoryService.findAll());
        return listResponseEntity;
    }

    @DeleteMapping("/delete/{titleCategory}")
    @Operation(summary = "Eliminar un Categoría por su nombre", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteCatByTitle(@PathVariable String titleCategory) throws NotFoundNameException, CategoryException {
        return categoryService.deleteByNameCat(titleCategory)
                .map(ResponseEntity::ok).orElse(ResponseEntity.badRequest().build());
    }

}
