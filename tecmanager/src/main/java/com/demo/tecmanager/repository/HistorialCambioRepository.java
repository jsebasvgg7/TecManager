package com.demo.tecmanager.repository;

import com.demo.tecmanager.document.HistorialCambio;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HistorialCambioRepository extends MongoRepository<HistorialCambio, String> {

    List<HistorialCambio> findByTareaIdOrderByFechaDesc(String tareaId);

    List<HistorialCambio> findByUsuarioId(String usuarioId);

}
