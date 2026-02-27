package com.demo.tecmanager.repository;

import com.demo.tecmanager.document.Reporte;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReporteRepository extends MongoRepository<Reporte, String> {

    List<Reporte> findByTareaId(String tareaId);

    List<Reporte> findByTecnicoId(String tecnicoId);

    boolean existsByTareaId(String tareaId);

}
