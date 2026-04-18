package com.demo.tecmanager.repository;

import com.demo.tecmanager.document.Tarea;
import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface TareaRepository extends MongoRepository<Tarea, String> {

    // ── Originales ──
    List<Tarea> findByTecnicoId(String tecnicoId);
    List<Tarea> findByEstado(EstadoTarea estado);
    List<Tarea> findByPrioridad(Prioridad prioridad);
    List<Tarea> findByTecnicoIdAndEstado(String tecnicoId, EstadoTarea estado);
    List<Tarea> findByTituloContainingIgnoreCase(String titulo);

    @Query("{ 'fecha_limite': { $lt: ?0 }, 'estado': { $ne: 'FINALIZADA' } }")
    List<Tarea> findTareasVencidas(LocalDateTime ahora);

    @Query("{ 'estado': ?0 }")
    Page<Tarea> findByEstado(EstadoTarea estado, Pageable pageable);

    @Query("{ 'tecnico_id': ?0, 'estado': ?1 }")
    Page<Tarea> findByTecnicoIdAndEstado(String tecnicoId, EstadoTarea estado, Pageable pageable);

    @Query("{ $and: [ " +
    "{ $or: [ { 'titulo': { $regex: ?0, $options: 'i' } }, { $expr: { $eq: ['', ?0] } } ] }, " +
    "{ $or: [ { 'estado': ?1 }, { $expr: { $eq: [null, ?1] } } ] }, " +
    "{ $or: [ { 'prioridad': ?2 }, { $expr: { $eq: [null, ?2] } } ] }, " +
    "{ $or: [ { 'categoria_id': ?3 }, { $expr: { $eq: [null, ?3] } } ] } " +"] }")
    Page<Tarea> findWithFilters(String titulo, EstadoTarea estado,
    Prioridad prioridad, String categoriaId, Pageable pageable);

    long countByEstado(EstadoTarea estado);
    long countByTecnicoIdAndEstadoNot(String tecnicoId, EstadoTarea estado);

    // ── Nuevos ──
    List<Tarea> findByTecnicosIdsContaining(String tecnicoId);
    List<Tarea> findByCategoriaId(String categoriaId);
    List<Tarea> findByCreadaPor(String creadaPor);
    long countByTecnicoId(String tecnicoId);

    Page<Tarea> findAll(Pageable pageable);
    Page<Tarea> findByTecnicoId(String tecnicoId, Pageable pageable);

    
}