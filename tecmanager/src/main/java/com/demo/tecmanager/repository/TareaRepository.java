package com.demo.tecmanager.repository;

import com.demo.tecmanager.document.Tarea;
import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import com.demo.tecmanager.dto.dashboard.TecnicoConteo;
import org.springframework.data.mongodb.repository.Aggregation;
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

        List<Tarea> findByTituloContainingIgnoreCase(String titulo);

        @Query("{ 'fecha_limite': { $lt: ?0 }, 'estado': { $ne: 'FINALIZADA' } }")
        List<Tarea> findTareasVencidas(LocalDateTime ahora);

        // ── Paginados ──
        Page<Tarea> findAll(Pageable pageable);

        Page<Tarea> findByTecnicoId(String tecnicoId, Pageable pageable);

        @Query("{ 'estado': ?0 }")
        Page<Tarea> findByEstado(EstadoTarea estado, Pageable pageable);

        @Query("{ 'tecnico_id': ?0, 'estado': ?1 }")
        Page<Tarea> findByTecnicoIdAndEstado(String tecnicoId, EstadoTarea estado, Pageable pageable);

        @Query("{ $and: [ " +
                        "{ $or: [ { 'titulo': { $regex: ?0, $options: 'i' } }, { $expr: { $eq: ['', ?0] } } ] }, " +
                        "{ $or: [ { 'estado': ?1 }, { $expr: { $eq: [null, ?1] } } ] }, " +
                        "{ $or: [ { 'prioridad': ?2 }, { $expr: { $eq: [null, ?2] } } ] }, " +
                        "{ $or: [ { 'categoria_id': ?3 }, { $expr: { $eq: [null, ?3] } } ] } " +
                        "] }")
        Page<Tarea> findWithFilters(String titulo, EstadoTarea estado,
                        Prioridad prioridad, String categoriaId, Pageable pageable);

        // ── Dashboard conteos ──
        long countByEstado(EstadoTarea estado);

        long countByTecnicoIdAndEstadoNot(String tecnicoId, EstadoTarea estado);

        long countByTecnicoId(String tecnicoId);

        long countByPrioridadAndEstadoNot(Prioridad prioridad, EstadoTarea estado);

        @Query(value = "{ 'fecha_limite': { $lt: ?0 }, 'estado': { $ne: 'FINALIZADA' } }", count = true)
        long countVencidas(LocalDateTime ahora);

        @Query(value = "{ 'estado': 'FINALIZADA', " +
                        "'fecha_finalizacion': { $ne: null }, " +
                        "'fecha_limite': { $ne: null }, " +
                        "$expr: { $lte: ['$fecha_finalizacion', '$fecha_limite'] } }", count = true)
        long countFinalizadasATiempo();

        // ── Dashboard agregación ──
        @Aggregation(pipeline = {
                        "{ $match: { 'estado': 'FINALIZADA', 'tiempo_real_horas': { $ne: null } } }",
                        "{ $group: { _id: null, promedio: { $avg: '$tiempo_real_horas' } } }"
        })
        Double promedioTiempoReal();

        // ── Cuenta activas agrupadas por técnico ──
        @Aggregation(pipeline = {
                        "{ $match: { 'tecnico_id': { $in: ?0 }, 'estado': { $ne: 'FINALIZADA' } } }",
                        "{ $group: { _id: '$tecnico_id', count: { $sum: 1 } } }"
        })
        List<TecnicoConteo> countActivasByTecnicoId(List<String> tecnicoIds);

        // ── Cuenta finalizadas y promedio agrupados por técnico ──
        @Aggregation(pipeline = {
                        "{ $match: { 'tecnico_id': { $in: ?0 }, 'estado': 'FINALIZADA' } }",
                        "{ $group: { _id: '$tecnico_id', count: { $sum: 1 }, promedio: { $avg: '$tiempo_real_horas' } } }"
        })
        List<TecnicoConteo> countFinalizadasByTecnicoId(List<String> tecnicoIds);

        // ── Técnicos — solo campos necesarios (proyección) ──
        @Query(value = "{ 'tecnico_id': { $in: ?0 }, 'estado': { $ne: ?1 } }", fields = "{ 'tecnico_id': 1, 'estado': 1 }")
        List<Tarea> findByTecnicoIdInAndEstadoNot(List<String> tecnicoIds, EstadoTarea estado);

        @Query(value = "{ 'tecnico_id': { $in: ?0 }, 'estado': ?1 }", fields = "{ 'tecnico_id': 1, 'estado': 1, 'tiempo_real_horas': 1 }")
        List<Tarea> findByTecnicoIdInAndEstado(List<String> tecnicoIds, EstadoTarea estado);

        // ── Otros ──
        List<Tarea> findByTecnicosIdsContaining(String tecnicoId);

        List<Tarea> findByCategoriaId(String categoriaId);

        List<Tarea> findByCreadaPor(String creadaPor);

        // ── Ya no se usa pero se mantiene por compatibilidad ──
        @Query("{ 'estado': 'FINALIZADA' }")
        List<Tarea> findByEstadoWithTiempos(EstadoTarea estado);
}