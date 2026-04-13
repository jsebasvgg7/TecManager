package com.demo.tecmanager.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.tecmanager.document.Tarea;
import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.dto.dashboard.DashboardResponse;
import com.demo.tecmanager.dto.dashboard.TecnicoMetricaResponse;
import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import com.demo.tecmanager.enums.Rol;
import com.demo.tecmanager.repository.TareaRepository;
import com.demo.tecmanager.repository.UsuarioRepository;

@Service
public class DashboardService {

    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public DashboardService(TareaRepository tareaRepository, UsuarioRepository usuarioRepository) {
        this.tareaRepository = tareaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public DashboardResponse obtenerMetricas() {
        DashboardResponse dashboard = new DashboardResponse();
        List<Tarea> todasLasTareas = tareaRepository.findAll();
        LocalDateTime ahora = LocalDateTime.now();

        dashboard.setTotalTareas(todasLasTareas.size());
        dashboard.setTareasPendientes(tareaRepository.countByEstado(EstadoTarea.PENDIENTE));
        dashboard.setTareasEnProceso(tareaRepository.countByEstado(EstadoTarea.EN_PROCESO));
        dashboard.setTareasFinalizadas(tareaRepository.countByEstado(EstadoTarea.FINALIZADA));
        dashboard.setTareasEnEspera(tareaRepository.countByEstado(EstadoTarea.EN_ESPERA));

        long Vencidas = todasLasTareas.stream().filter(t -> t.getFechaLimite() != null && ahora.isAfter(t.getFechaLimite()) && t.getEstado() != EstadoTarea.FINALIZADA).count();
        dashboard.setTareasVencidas(Vencidas);

        List<Tarea> tareasActivas = todasLasTareas.stream().filter(t -> t.getEstado() != EstadoTarea.FINALIZADA).collect(Collectors.toList());

        dashboard.setTareasAltaPrioridad(tareasActivas.stream().filter(t -> t.getPrioridad() == Prioridad.ALTA).count());
        dashboard.setTareasMediaPrioridad(tareasActivas.stream().filter(t -> t.getPrioridad() == Prioridad.MEDIA).count());
        dashboard.setTareasBajaPrioridad(tareasActivas.stream().filter(t -> t.getPrioridad() == Prioridad.BAJA).count());

        List<Tarea> finalizadas = todasLasTareas.stream().filter(t -> t.getEstado() == EstadoTarea.FINALIZADA).collect(Collectors.toList());

        if (!finalizadas.isEmpty()) {
            long aTiempo = finalizadas.stream().filter(t -> t.getFechaFinalizacion() != null && t.getFechaLimite() != null && !t.getFechaFinalizacion().isAfter(t.getFechaLimite())).count();
            double porcentaje = ((double) aTiempo / finalizadas.size()) * 100;
            dashboard.setPorcentajeFinalizadasATiempo(Math.round(porcentaje * 10.0) / 10.0);
        } else {
            dashboard.setPorcentajeFinalizadasATiempo(0.0);
        }

        double tiempoPromedio = finalizadas.stream().filter(t -> t.getTiempoRealHoras() != null).mapToInt(Tarea::getTiempoRealHoras).average().orElse(0.0);
        dashboard.setTiempoPromedioResolucionHoras(Math.round(tiempoPromedio * 10.0) / 10.0);

        List<Usuario> tecnicos = usuarioRepository.findByRol(Rol.TECNICO);
        List<TecnicoMetricaResponse> metricasTecnicos = new ArrayList<>();

        for (Usuario tecnico : tecnicos) {
            List<Tarea> tareasTecnico = tareaRepository.findByTecnicoId(tecnico.getId());

            long activas = tareasTecnico.stream().filter(t -> t.getEstado() != EstadoTarea.FINALIZADA).count();
            long finalizadasTecnico = tareasTecnico.stream().filter(t -> t.getEstado() != EstadoTarea.FINALIZADA).count();
            double promedioTecnico = tareasTecnico.stream().filter(t -> t.getEstado() == EstadoTarea.FINALIZADA && t.getTiempoRealHoras() != null).mapToInt(Tarea::getTiempoRealHoras).average().orElse(0.0);

            metricasTecnicos.add(new TecnicoMetricaResponse(tecnico.getId(), tecnico.getNombre(), activas, finalizadasTecnico, Math.round(promedioTecnico * 10.0) / 10.0));

        }

        List<TecnicoMetricaResponse> conMasTareas = metricasTecnicos.stream().sorted(Comparator.comparingLong(TecnicoMetricaResponse::getTotalTareasActivas).reversed()).limit(5).collect(Collectors.toList());
        dashboard.setTecnicosConMasTareas(conMasTareas);

        List<TecnicoMetricaResponse> masEficientes = metricasTecnicos.stream().filter(t -> t.getTotalTareasFinalizadas() > 0).sorted(Comparator.comparingDouble(TecnicoMetricaResponse::getTiempoPromedioHoras)).limit(5).collect(Collectors.toList());
        dashboard.setTecnicosMasEficientes(masEficientes);

        return dashboard;

    }

    public TecnicoMetricaResponse obtenerMetricasTecnico(String tecnicoId) {
        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException(
                        "Técnico no encontrado: " + tecnicoId));

        List<Tarea> tareas = tareaRepository.findByTecnicoId(tecnicoId);

        long activas = tareas.stream().filter(t -> t.getEstado() != EstadoTarea.FINALIZADA).count();
        long finalizadas = tareas.stream().filter(t -> t.getEstado() == EstadoTarea.FINALIZADA).count();
        double promedio = tareas.stream().filter(t -> t.getEstado() == EstadoTarea.FINALIZADA && t.getTiempoRealHoras() != null).mapToInt(Tarea::getTiempoRealHoras).average().orElse(0.0);

        return new TecnicoMetricaResponse(tecnico.getId(), tecnico.getNombre(), activas, finalizadas, Math.round(promedio * 10.0) / 10.0);
    }

}
