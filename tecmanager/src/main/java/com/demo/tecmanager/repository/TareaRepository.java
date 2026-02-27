package com.demo.tecmanager.repository;

import com.demo.tecmanager.document.Tarea;
import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TareaRepository extends MongoRepository<Tarea, String> {

    List<Tarea> findByTecnicoId(String tecnicoId);

    List<Tarea> findByEstado(EstadoTarea estado);

    List<Tarea> findByPrioridad(Prioridad prioridad);

    List<Tarea> findByTecnicoIdAndEstado(String tecnicoId, EstadoTarea estado);

    List<Tarea> findByTituloContainingIgnoreCase(String titulo);

    @Query("{ 'fecha_limite': { $lt: ?0 }, 'estado': { $ne: 'FINALIZADA' } }")
    List<Tarea> findTareasVecncidas(LocalDateTime ahora);

    long countByEstado(EstadoTarea estado);

    long countByTecnicoIdAndEstadoNot(String tecnicoId, EstadoTarea estado);

}
