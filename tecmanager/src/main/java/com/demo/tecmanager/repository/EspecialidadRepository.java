package com.demo.tecmanager.repository;

import com.demo.tecmanager.document.Especialidad;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EspecialidadRepository extends MongoRepository<Especialidad, String> {
    List<Especialidad> findByActivaTrue();
    boolean existsByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, String id);
}