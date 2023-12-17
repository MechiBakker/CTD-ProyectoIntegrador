package com.dh.equipo2.roadRunner.service;

import com.dh.equipo2.roadRunner.domain.Category;
import com.dh.equipo2.roadRunner.domain.Vehicle;
import com.dh.equipo2.roadRunner.dto.CategoryDto;
import com.dh.equipo2.roadRunner.dto.VehicleDto;
import com.dh.equipo2.roadRunner.exceptions.CategoryException;
import com.dh.equipo2.roadRunner.exceptions.DuplicateNameException;
import com.dh.equipo2.roadRunner.exceptions.NotFoundNameException;
import com.dh.equipo2.roadRunner.repository.CategoryRepository;
import com.dh.equipo2.roadRunner.repository.VehicleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ImageService imageService;

    @Transactional
    public Optional<String> createCat(CategoryDto categoryDto, MultipartFile multipartFile) throws DuplicateNameException {
        String message = null;

        if (categoryDto != null) {
            if (categoryRepository.getByTitle(categoryDto.getTitle()).isPresent()) {
                log.error("La Categoría con nombre: " + categoryDto.getTitle()+ " ya existe");
                throw new DuplicateNameException("La Categoría con nombre: " + categoryDto.getTitle() + " ya existe");
            }

            imageService.uploadImage(categoryDto.getImageUrl(), multipartFile);
            Category category = mapper.convertValue(categoryDto, Category.class);
            category.setImageUrl(imageService.getUrlImage(categoryDto.getImageUrl()));
            categoryRepository.save(category);
            message = "Se ha creado con éxito la nueva categoría";
            log.info(message);
        }
        return Optional.ofNullable(message);
    }

    public Optional<CategoryDto> getByNameCat(String title) throws NotFoundNameException {

        CategoryDto categoryDto = null;

        Optional<Category> optionalCategory = categoryRepository.getByTitle(title);

        if (optionalCategory.isEmpty()){
            log.error("Lo sentimos, no se encontró ninguna Categoría con el nombre: " + title);
            throw new NotFoundNameException("Lo sentimos, no se encontró ninguna Categoría con el nombre: " + title);
        }
        categoryDto = mapper.convertValue(optionalCategory.get(),CategoryDto.class);
        return Optional.ofNullable(categoryDto);
    }

    public Optional<String> deleteByNameCat(String title) throws NotFoundNameException, CategoryException {

        String message = null;

        Optional<CategoryDto> optionalCategoryDto = this.getByNameCat(title);

        if (optionalCategoryDto.isPresent()){
            List<Vehicle> vehicles = vehicleRepository.getAllByCat(title);
            if (vehicles.size()>=1){
                log.error("No se puede eliminar la categoria porque tiene " + vehicles.size() + " vehículos asignados");
                throw new CategoryException("No se puede eliminar la categoria porque tiene " + vehicles.size() + " vehículos asignados");
            }
            categoryRepository.deleteByTitle(title);
            message = "La categoria: " + title + " fue eliminada exitosamente";
            log.info(message);
        }
        return Optional.ofNullable(message);
    }

    @Transactional
    public Optional<String> updateByTitle(String title, CategoryDto categoryDto, MultipartFile multipartFile) throws NotFoundNameException, CategoryException, DuplicateNameException {

        String message = null;
        this.deleteByNameCat(title);
        this.createCat(categoryDto, multipartFile);
        message = "La categoría: " + title + " fue actualizada exitosamente";
        log.info(message);
        return Optional.ofNullable(message);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> findAll(){

        List<CategoryDto> listCategoryDto = new ArrayList<>();

        List<Category> categoryList = categoryRepository.findAll();

        for (Category category:categoryList){
            listCategoryDto.add(mapper.convertValue(category, CategoryDto.class));
        }

        return listCategoryDto;
    }

}
