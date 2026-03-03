package com.demo.tecmanager.service;

import com.demo.tecmanager.document.Reporte;
import com.demo.tecmanager.document.Tarea;
import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.dto.tarea.CambioEstadoRequest;
import com.demo.tecmanager.dto.tarea.TareaRequest;
import com.demo.tecmanager.dto.tarea.TareaResponse;
import com.demo.tecmanager.enums.AccionHistorial;
import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import com.demo.tecmanager.exception.ResourceNotFoundException;
import com.demo.tecmanager.repository.ReporteRepository;
import com.demo.tecmanager.repository.TareaRepository;
import com.demo.tecmanager.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.repository.support.Repositories;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReporteRepository reporteRepository;
    private final HistorialService historialService;
    private final NotificacionService notificacionService;

    @Autowired
    public TareaService(TareaRepository tareaRepository, UsuarioRepository usuarioRepository, ReporteRepository reporteRepository, HistorialService historialService, NotificacionService notificacionService) {
        this.tareaRepository = tareaRepository;
        this.usuarioRepository = usuarioRepository;
        this.reporteRepository = reporteRepository;
        this.historialService = historialService;
        this.notificacionService = notificacionService;
    }

    private TareaResponse crearConId(TareaRequest request, String creadaPorId) {
        if (request.getTecnicoId() != null && !request.getTecnicoId().isBlank()) {
            Usuario tecnico = usuarioRepository.findById(request.getTecnicoId()).orElseThrow(() -> new ResourceNotFoundException("Técnico no encontrado con id: " + request.getTecnicoId()));
        if (!tecnico.isActivo()) {
            throw new IllegalArgumentException("No se puede asignar una tarea a un usuario inactivo");
        }
        }

        Tarea tarea = new Tarea(request.getTitulo(), request.getDescripcion(), request.getPrioridad(), request.getTecnicoId(), creadaPorId, request.getFechaLimite(), request.getTiempoEstimadoHoras());

        Tarea guardada = tareaRepository.save(tarea);

        historialService.registrar(guardada.getId(), creadaPorId, AccionHistorial.CREACION, null, guardada.getTitulo());

        if (guardada.getTecnicoId() != null) {
            notificacionService.notificar(guardada.getTecnicoId(),"Se te asignó una nueva tarea: " + guardada.getTitulo());
    }
        return toResponse(guardada);
    }

    public TareaResponse crear(TareaRequest request, String emailCreador) {
        Usuario creador = usuarioRepository.findByEmail(emailCreador).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + emailCreador));
        return crearConId(request, creador.getId());
    }

    public List<TareaResponse> listarTodas() {
        return tareaRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    } 

    public List<TareaResponse> listarPorTecnico(String tecnicoId) {
        return tareaRepository.findByTecnicoId(tecnicoId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> listarPorTecnicoEmail(String email) {
        Usuario tecnico = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));
        return tareaRepository.findByTecnicoId(tecnico.getId()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> listarPorEstado(EstadoTarea estado) {
        return tareaRepository.findByEstado(estado).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> listarPorPrioridad(Prioridad prioridad) {
        return tareaRepository.findByPrioridad(prioridad).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> listarVencidas() {
        return tareaRepository.findTareasVencidas(LocalDateTime.now()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> buscarPorTitulo(String titulo) {
        return tareaRepository.findByTituloContainingIgnoreCase(titulo).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TareaResponse obtenerPorId(String id) {
        return toResponse(buscarPorIdOFallar(id));
    }

    public TareaResponse editar(String id, TareaRequest request, String usuarioId) {
        Tarea tarea = buscarPorIdOFallar(id);
        String tituloAnterior = tarea.getTitulo();

        tarea.setTitulo(request.getTitulo());
        tarea.setDescripcion(request.getDescripcion());
        tarea.setPrioridad(request.getPrioridad());
        tarea.setFechaLimite(request.getFechaLimite());
        tarea.setTiempoEstimadoHoras(request.getTiempoEstimadoHoras());

        Tarea actualizada = tareaRepository.save(tarea);

        historialService.registrar(id, usuarioId, AccionHistorial.EDICION, tituloAnterior, actualizada.getTitulo());

        return toResponse(actualizada);
    }

    public TareaResponse asignarTecnico(String tareaId, String tecnicoId, String usuarioId) {
        Tarea tarea = buscarPorIdOFallar(tareaId);
        
        Usuario tecnico = usuarioRepository.findById(tecnicoId).orElseThrow(() -> new ResourceNotFoundException("Tecnico no encontrado con id: " + tecnicoId));

        if (!tecnico.isActivo()) {
            throw new IllegalArgumentException("no se puede asignar una tarea a un usuario inactivo");
        }

        String tecnicoAnterior = tarea.getTecnicoId();
        tarea.setTecnicoId(tecnicoId);
        Tarea actualizada = tareaRepository.save(tarea);

        historialService.registrar(tareaId, usuarioId, AccionHistorial.REASIGNACION, tecnicoAnterior, tecnicoId);

        notificacionService.notificar(tecnicoId, "Se te asigno la tarea: " + tarea.getTitulo());

        return toResponse(actualizada);
    }

    public TareaResponse cambiarEstado(String tareaId, CambioEstadoRequest request, String tecnicoId) {
        Tarea tarea = buscarPorIdOFallar(tareaId);
        EstadoTarea estadoAnterior = tarea.getEstado();
        EstadoTarea nuevoEstado = request.getNuevoEstado();

        if (nuevoEstado == EstadoTarea.EN_PROCESO && tarea.getFechaInicioProceso() == null) {
            tarea.setFechaInicioProceso(LocalDateTime.now());
        } 

        if (nuevoEstado == EstadoTarea.FINALIZADA) {
            tarea.setFechaFinalizacion(LocalDateTime.now());

            if (tarea.getFechaInicioProceso() != null) {
                long horas = java.time.Duration.between(tarea.getFechaInicioProceso(), tarea.getFechaFinalizacion()).toHours();
                tarea.setTiempoRealHoras((int) horas);
            }
        }

        tarea.setEstado(nuevoEstado);
        Tarea actualizada = tareaRepository.save(tarea);

        Reporte reporte = new Reporte(tareaId, tecnicoId, request.getComentario(), nuevoEstado);
        reporteRepository.save(reporte);

        historialService.registrar(tareaId, tecnicoId, AccionHistorial.CAMBIO_ESTADO, estadoAnterior.name(), nuevoEstado.name());

        if (tarea.getCreadaPor() != null ) {
            notificacionService.notificar(tarea.getCreadaPor(), "La tarea '" + tarea.getTitulo() + "' cambio de estado a: " + nuevoEstado.name());
        }

        return toResponse(actualizada);
    }

    public void eliminar(String id) {
        if (!tareaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tarea no encontrada con id: " + id);
        }
        tareaRepository.deleteById(id);
    }

    private Tarea buscarPorIdOFallar(String id) {
        return tareaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada con id: " + id));
    }

    private TareaResponse toResponse(Tarea tarea) {
        TareaResponse response = new TareaResponse();
        response.setId(tarea.getId());
        response.setTitulo(tarea.getTitulo());
        response.setDescripcion(tarea.getDescripcion());
        response.setPrioridad(tarea.getPrioridad());
        response.setEstado(tarea.getEstado());
        response.setTecnicoId(tarea.getTecnicoId());
        response.setCreadaPor(tarea.getCreadaPor());
        response.setFechaCreacion(tarea.getFechaCreacion());
        response.setFechaLimite(tarea.getFechaLimite());
        response.setTiempoEstimadoHoras(tarea.getTiempoEstimadoHoras());
        response.setTiempoRealHoras(tarea.getTiempoRealHoras());

        boolean Vencida = tarea.getFechaLimite() != null && LocalDateTime.now().isAfter(tarea.getFechaLimite()) && tarea.getEstado() != EstadoTarea.FINALIZADA;
        response.setVencida(Vencida);

        if (tarea.getTecnicoId() != null) {
            usuarioRepository.findById(tarea.getTecnicoId()).ifPresent(u -> response.setTecnicoNombre(u.getNombre()));
        }
        return response;
    }

}
