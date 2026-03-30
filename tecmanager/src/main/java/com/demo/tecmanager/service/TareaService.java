package com.demo.tecmanager.service;

import com.demo.tecmanager.document.Categoria;
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
import com.demo.tecmanager.repository.CategoriaRepository;
import com.demo.tecmanager.repository.ReporteRepository;
import com.demo.tecmanager.repository.TareaRepository;
import com.demo.tecmanager.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TareaService {

    private final TareaRepository      tareaRepository;
    private final UsuarioRepository    usuarioRepository;
    private final ReporteRepository    reporteRepository;
    private final HistorialService     historialService;
    private final NotificacionService  notificacionService;
    private final CategoriaRepository  categoriaRepository;

    @Autowired
    public TareaService(TareaRepository tareaRepository,
                        UsuarioRepository usuarioRepository,
                        ReporteRepository reporteRepository,
                        HistorialService historialService,
                        NotificacionService notificacionService,
                        CategoriaRepository categoriaRepository) {
        this.tareaRepository     = tareaRepository;
        this.usuarioRepository   = usuarioRepository;
        this.reporteRepository   = reporteRepository;
        this.historialService    = historialService;
        this.notificacionService = notificacionService;
        this.categoriaRepository = categoriaRepository;
    }

    // ══════════════════════════════════════════════════════════════
    //  CREAR
    // ══════════════════════════════════════════════════════════════
    public TareaResponse crear(TareaRequest request, String emailCreador) {

        Usuario creador = usuarioRepository.findByEmail(emailCreador)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + emailCreador));

        if (request.getTecnicoId() != null && !request.getTecnicoId().isBlank()) {
            Usuario tecnico = usuarioRepository.findById(request.getTecnicoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Técnico no encontrado: " + request.getTecnicoId()));
            if (!tecnico.isActivo())
                throw new IllegalArgumentException("No se puede asignar una tarea a un usuario inactivo");
        }

        // Usar constructor original de 7 parámetros que ya existe en Tarea.java
        Tarea tarea = new Tarea(
                request.getTitulo(),
                request.getDescripcion(),
                request.getPrioridad(),
                request.getTecnicoId(),
                creador.getId(),
                request.getFechaLimite(),
                request.getTiempoEstimadoHoras(),
                null
        );

        // Campos nuevos (setters agregados en Tarea.java)
        tarea.setCategoriaId(request.getCategoriaId());
        tarea.setTecnicosIds(request.getTecnicosIds() != null ? request.getTecnicosIds() : new ArrayList<>());
        tarea.setEtiquetas(request.getEtiquetas() != null ? request.getEtiquetas() : new ArrayList<>());
        tarea.setPorcentajeAvance(0);

        // Calcular SLA si hay categoría asignada
        if (request.getCategoriaId() != null && !request.getCategoriaId().isBlank()) {
            categoriaRepository.findById(request.getCategoriaId()).ifPresent(cat ->
                    tarea.setFechaLimiteSla(LocalDateTime.now().plusHours(horasSla(cat, request.getPrioridad())))
            );
        }

        Tarea guardada = tareaRepository.save(tarea);

        historialService.registrar(guardada.getId(), creador.getId(),
                AccionHistorial.CREACION, null, guardada.getTitulo());

        if (guardada.getTecnicoId() != null)
            notificacionService.notificar(guardada.getTecnicoId(),
                    "Se te asignó una nueva tarea: " + guardada.getTitulo());

        if (guardada.getTecnicosIds() != null)
            guardada.getTecnicosIds().forEach(id ->
                    notificacionService.notificar(id, "Fuiste agregado como colaborador en: " + guardada.getTitulo()));

        return toResponse(guardada);
    }

    // ══════════════════════════════════════════════════════════════
    //  EDITAR  (llamado también como "actualizar" desde el controller)
    // ══════════════════════════════════════════════════════════════
    public TareaResponse editar(String tareaId, TareaRequest request, String emailUsuario) {
        Tarea tarea = buscarOFallar(tareaId);

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + emailUsuario));

        String tituloAnterior = tarea.getTitulo();

        tarea.setTitulo(request.getTitulo());
        tarea.setDescripcion(request.getDescripcion());
        tarea.setPrioridad(request.getPrioridad());
        tarea.setFechaLimite(request.getFechaLimite());
        tarea.setTiempoEstimadoHoras(request.getTiempoEstimadoHoras());
        tarea.setEtiquetas(request.getEtiquetas() != null ? request.getEtiquetas() : new ArrayList<>());

        if (request.getTecnicoId() != null && !request.getTecnicoId().isBlank()) {
            Usuario tecnico = usuarioRepository.findById(request.getTecnicoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Técnico no encontrado: " + request.getTecnicoId()));
            if (!tecnico.isActivo())
                throw new IllegalArgumentException("No se puede asignar a un usuario inactivo");
            tarea.setTecnicoId(request.getTecnicoId());
        }

        if (request.getTecnicosIds() != null)
            tarea.setTecnicosIds(request.getTecnicosIds());

        if (request.getCategoriaId() != null) {
            tarea.setCategoriaId(request.getCategoriaId());
            if (tarea.getEstado() == EstadoTarea.PENDIENTE) {
                categoriaRepository.findById(request.getCategoriaId()).ifPresent(cat ->
                        tarea.setFechaLimiteSla(LocalDateTime.now().plusHours(horasSla(cat, tarea.getPrioridad())))
                );
            }
        }

        historialService.registrar(tareaId, usuario.getId(),
                AccionHistorial.EDICION, tituloAnterior, request.getTitulo());

        return toResponse(tareaRepository.save(tarea));
    }

    // Alias para el TareaController nuevo que usa "actualizar"
    public TareaResponse actualizar(String tareaId, TareaRequest request, String emailUsuario) {
        return editar(tareaId, request, emailUsuario);
    }

    // ══════════════════════════════════════════════════════════════
    //  ASIGNAR TÉCNICO
    // ══════════════════════════════════════════════════════════════
    public TareaResponse asignarTecnico(String tareaId, String tecnicoId, String emailUsuario) {
        Tarea tarea = buscarOFallar(tareaId);

        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + emailUsuario));

        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new ResourceNotFoundException("Técnico no encontrado: " + tecnicoId));

        if (!tecnico.isActivo())
            throw new IllegalArgumentException("No se puede asignar una tarea a un usuario inactivo");

        String tecnicoAnterior = tarea.getTecnicoId();
        tarea.setTecnicoId(tecnicoId);

        historialService.registrar(tareaId, usuarioAutenticado.getId(),
                AccionHistorial.REASIGNACION, tecnicoAnterior, tecnicoId);

        notificacionService.notificar(tecnicoId, "Se te asignó la tarea: " + tarea.getTitulo());

        return toResponse(tareaRepository.save(tarea));
    }

    // ══════════════════════════════════════════════════════════════
    //  CAMBIAR ESTADO
    // ══════════════════════════════════════════════════════════════
    public TareaResponse cambiarEstado(String tareaId, CambioEstadoRequest request, String emailTecnico) {
        Tarea tarea = buscarOFallar(tareaId);

        Usuario tecnico = usuarioRepository.findByEmail(emailTecnico)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + emailTecnico));

        EstadoTarea estadoAnterior = tarea.getEstado();
        EstadoTarea nuevoEstado    = request.getNuevoEstado();

        if (nuevoEstado == EstadoTarea.FINALIZADA) {
            LocalDateTime ahora = LocalDateTime.now();
            tarea.setFechaFinalizacion(ahora);

            LocalDateTime inicio = tarea.getFechaInicioProceso() != null
            ? tarea.getFechaInicioProceso()
            : tarea.getFechaCreacion();

            if (inicio != null) {
                long minutos = java.time.Duration.between(inicio, ahora).toMinutes();
                int horas = (int) Math.max(1, Math.ceil(minutos / 60.0));
                tarea.setTiempoRealHoras(horas);
            }
        }

        tarea.setEstado(nuevoEstado);
        Tarea actualizada = tareaRepository.save(tarea);

        reporteRepository.save(new Reporte(tareaId, tecnico.getId(), request.getComentario(), nuevoEstado));

        historialService.registrar(tareaId, tecnico.getId(),
                AccionHistorial.CAMBIO_ESTADO, estadoAnterior.name(), nuevoEstado.name());

        if (tarea.getCreadaPor() != null)
            notificacionService.notificar(tarea.getCreadaPor(),
                    "La tarea '" + tarea.getTitulo() + "' cambió a: " + nuevoEstado.name());

        return toResponse(actualizada);
    }

    // ══════════════════════════════════════════════════════════════
    //  ACTUALIZAR AVANCE
    // ══════════════════════════════════════════════════════════════
    public TareaResponse actualizarAvance(String tareaId, Integer porcentaje, String emailUsuario) {
        Tarea tarea = buscarOFallar(tareaId);

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + emailUsuario));

        boolean esResponsable = usuario.getId().equals(tarea.getTecnicoId());
        boolean esColaborador = tarea.getTecnicosIds() != null
                                && tarea.getTecnicosIds().contains(usuario.getId());

        if (!esResponsable && !esColaborador)
            throw new IllegalArgumentException("No tienes permiso para actualizar esta tarea");
        if (porcentaje < 0 || porcentaje > 100)
            throw new IllegalArgumentException("El porcentaje debe estar entre 0 y 100");

        tarea.setPorcentajeAvance(porcentaje);

        historialService.registrar(tareaId, usuario.getId(),
                AccionHistorial.EDICION, null, "Avance: " + porcentaje + "%");

        return toResponse(tareaRepository.save(tarea));
    }

    // ══════════════════════════════════════════════════════════════
    //  CONSULTAS
    // ══════════════════════════════════════════════════════════════
    public List<TareaResponse> listarTodas() {
        return tareaRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    // Usado por el TareaController nuevo (recibe email desde auth.getName())
    public List<TareaResponse> listarPorTecnico(String emailOId) {
        // Intentar buscar por email primero; si no, asumir que es un ID
        String tecnicoId = usuarioRepository.findByEmail(emailOId)
                .map(Usuario::getId)
                .orElse(emailOId);

        List<Tarea> comoResponsable = tareaRepository.findByTecnicoId(tecnicoId);
        List<Tarea> comoColaborador = tareaRepository.findByTecnicosIdsContaining(tecnicoId);

        return java.util.stream.Stream
                .concat(comoResponsable.stream(), comoColaborador.stream())
                .distinct()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Alias para el TareaController original que lo llama con email
    public List<TareaResponse> listarPorTecnicoEmail(String email) {
        return listarPorTecnico(email);
    }

    // Tareas crudas para el endpoint /mis-tareas original
    public List<Tarea> obtenerMisTareas(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return tareaRepository.findByTecnicoId(usuario.getId());
    }

    public List<TareaResponse> listarPorCategoria(String categoriaId) {
        return tareaRepository.findByCategoriaId(categoriaId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> listarPorEstado(EstadoTarea estado) {
        return tareaRepository.findByEstado(estado).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> listarPorPrioridad(Prioridad prioridad) {
        return tareaRepository.findByPrioridad(prioridad).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> listarVencidas() {
        return tareaRepository.findTareasVencidas(LocalDateTime.now()).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<TareaResponse> buscarPorTitulo(String titulo) {
        return tareaRepository.findByTituloContainingIgnoreCase(titulo).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public TareaResponse obtenerPorId(String id) {
        return toResponse(buscarOFallar(id));
    }

    public void eliminar(String id) {
        if (!tareaRepository.existsById(id))
            throw new ResourceNotFoundException("Tarea no encontrada con id: " + id);
        tareaRepository.deleteById(id);
    }

    // ══════════════════════════════════════════════════════════════
    //  HELPERS PRIVADOS
    // ══════════════════════════════════════════════════════════════
    private Tarea buscarOFallar(String id) {
        return tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada con id: " + id));
    }

    private int horasSla(Categoria cat, Prioridad prioridad) {
        return switch (prioridad) {
            case ALTA  -> cat.getSlaAltaHoras()  != null ? cat.getSlaAltaHoras()  : 4;
            case MEDIA -> cat.getSlaMediaHoras() != null ? cat.getSlaMediaHoras() : 24;
            case BAJA  -> cat.getSlaBajaHoras()  != null ? cat.getSlaBajaHoras()  : 72;
        };
    }

    private TareaResponse toResponse(Tarea tarea) {
        TareaResponse r = new TareaResponse();

        // Campos originales
        r.setId(tarea.getId());
        r.setTitulo(tarea.getTitulo());
        r.setDescripcion(tarea.getDescripcion());
        r.setPrioridad(tarea.getPrioridad());
        r.setEstado(tarea.getEstado());
        r.setTecnicoId(tarea.getTecnicoId());
        r.setCreadaPor(tarea.getCreadaPor());
        r.setFechaCreacion(tarea.getFechaCreacion());
        r.setFechaLimite(tarea.getFechaLimite());
        r.setTiempoEstimadoHoras(tarea.getTiempoEstimadoHoras());
        r.setTiempoRealHoras(tarea.getTiempoRealHoras());

        // Vencida por fechaLimite (lógica original)
        r.setVencida(tarea.getFechaLimite() != null
                && LocalDateTime.now().isAfter(tarea.getFechaLimite())
                && tarea.getEstado() != EstadoTarea.FINALIZADA);

        // Nombre del técnico responsable
        if (tarea.getTecnicoId() != null)
            usuarioRepository.findById(tarea.getTecnicoId())
                    .ifPresent(u -> r.setTecnicoNombre(u.getNombre()));

        // Campos nuevos
        r.setCategoriaId(tarea.getCategoriaId());
        r.setTecnicosIds(tarea.getTecnicosIds());
        r.setPorcentajeAvance(tarea.getPorcentajeAvance());
        r.setFechaLimiteSla(tarea.getFechaLimiteSla());
        r.setEtiquetas(tarea.getEtiquetas());
        r.setEvidenciaUrl(tarea.getEvidenciaUrl());

        // SLA vencido en tiempo real
        r.setSlaVencido(tarea.getFechaLimiteSla() != null
                && LocalDateTime.now().isAfter(tarea.getFechaLimiteSla())
                && tarea.getEstado() != EstadoTarea.FINALIZADA);

        // Info de categoría
        if (tarea.getCategoriaId() != null)
            categoriaRepository.findById(tarea.getCategoriaId()).ifPresent(cat -> {
                r.setCategoriaNombre(cat.getNombre());
                r.setCategoriaColor(cat.getColor());
                r.setCategoriaIcono(cat.getIcono());
            });

        // Nombres de colaboradores
        if (tarea.getTecnicosIds() != null && !tarea.getTecnicosIds().isEmpty()) {
            List<String> nombres = tarea.getTecnicosIds().stream()
                    .map(tid -> usuarioRepository.findById(tid)
                            .map(Usuario::getNombre)
                            .orElse("Desconocido"))
                    .collect(Collectors.toList());
            r.setTecnicosNombres(nombres);
        }

        return r;
    }
}