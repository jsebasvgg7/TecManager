package com.demo.tecmanager.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.tecmanager.document.Tarea;
import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.dto.dashboard.DashboardResponse;
import com.demo.tecmanager.dto.dashboard.TecnicoConteo;
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
                LocalDateTime ahora = LocalDateTime.now();

                // Conteos por estado — consultas directas a MongoDB (no trae documentos)
                long totalTareas = tareaRepository.count();
                long pendientes = tareaRepository.countByEstado(EstadoTarea.PENDIENTE);
                long enProceso = tareaRepository.countByEstado(EstadoTarea.EN_PROCESO);
                long finalizadas = tareaRepository.countByEstado(EstadoTarea.FINALIZADA);
                long enEspera = tareaRepository.countByEstado(EstadoTarea.EN_ESPERA);

                dashboard.setTotalTareas(totalTareas);
                dashboard.setTareasPendientes(pendientes);
                dashboard.setTareasEnProceso(enProceso);
                dashboard.setTareasFinalizadas(finalizadas);
                dashboard.setTareasEnEspera(enEspera);

                // Vencidas — solo trae las no finalizadas con fecha límite
                long vencidas = tareaRepository.countVencidas(ahora);
                dashboard.setTareasVencidas(vencidas);

                // Prioridades activas — solo cuenta, no trae documentos
                dashboard.setTareasAltaPrioridad(
                                tareaRepository.countByPrioridadAndEstadoNot(Prioridad.ALTA, EstadoTarea.FINALIZADA));
                dashboard.setTareasMediaPrioridad(
                                tareaRepository.countByPrioridadAndEstadoNot(Prioridad.MEDIA, EstadoTarea.FINALIZADA));
                dashboard.setTareasBajaPrioridad(
                                tareaRepository.countByPrioridadAndEstadoNot(Prioridad.BAJA, EstadoTarea.FINALIZADA));

                // Métricas de finalizadas — solo trae las finalizadas
                calcularMetricasFinalizadas(dashboard);

                // Métricas de técnicos — una sola consulta agrupada
                calcularMetricasTecnicos(dashboard);

                return dashboard;
        }

        private void calcularMetricasFinalizadas(DashboardResponse dashboard) {
                // Solo cuenta — no trae documentos
                long totalFinalizadas = tareaRepository.countByEstado(EstadoTarea.FINALIZADA);

                if (totalFinalizadas == 0) {
                        dashboard.setPorcentajeFinalizadasATiempo(0.0);
                        dashboard.setTiempoPromedioResolucionHoras(0.0);
                        return;
                }

                // Solo trae las finalizadas A TIEMPO — mucho menos datos
                long aTiempo = tareaRepository.countFinalizadasATiempo();

                double porcentaje = ((double) aTiempo / totalFinalizadas) * 100;
                dashboard.setPorcentajeFinalizadasATiempo(Math.round(porcentaje * 10.0) / 10.0);

                // Promedio de tiempo real — solo el campo necesario
                Double promedio = tareaRepository.promedioTiempoReal();
                double tiempoPromedio = promedio != null ? promedio : 0.0;
                dashboard.setTiempoPromedioResolucionHoras(Math.round(tiempoPromedio * 10.0) / 10.0);
        }

        private void calcularMetricasTecnicos(DashboardResponse dashboard) {
                List<Usuario> tecnicos = usuarioRepository.findByRolAndActivoTrue(Rol.TECNICO);
                if (tecnicos.isEmpty()) {
                        dashboard.setTecnicosConMasTareas(new ArrayList<>());
                        dashboard.setTecnicosMasEficientes(new ArrayList<>());
                        return;
                }

                List<String> tecnicoIds = tecnicos.stream()
                                .map(Usuario::getId)
                                .collect(Collectors.toList());

                // DOS agregaciones en lugar de traer documentos
                Map<String, Long> activasPorTecnico = tareaRepository
                                .countActivasByTecnicoId(tecnicoIds)
                                .stream()
                                .collect(Collectors.toMap(TecnicoConteo::getId, TecnicoConteo::getCount));

                Map<String, TecnicoConteo> finalizadasPorTecnico = tareaRepository
                                .countFinalizadasByTecnicoId(tecnicoIds)
                                .stream()
                                .collect(Collectors.toMap(TecnicoConteo::getId, c -> c));

                List<TecnicoMetricaResponse> metricas = tecnicos.stream()
                                .map(t -> {
                                        TecnicoConteo fin = finalizadasPorTecnico.get(t.getId());
                                        long activas = activasPorTecnico.getOrDefault(t.getId(), 0L);
                                        long finalizadas = fin != null ? fin.getCount() : 0L;
                                        double promedio = fin != null && fin.getPromedio() != null
                                                        ? Math.round(fin.getPromedio() * 10.0) / 10.0
                                                        : 0.0;
                                        return new TecnicoMetricaResponse(
                                                        t.getId(), t.getNombre(), activas, finalizadas, promedio);
                                })
                                .collect(Collectors.toList());

                dashboard.setTecnicosConMasTareas(
                                metricas.stream()
                                                .sorted(Comparator.comparingLong(
                                                                TecnicoMetricaResponse::getTotalTareasActivas)
                                                                .reversed())
                                                .limit(5)
                                                .collect(Collectors.toList()));

                dashboard.setTecnicosMasEficientes(
                                metricas.stream()
                                                .filter(t -> t.getTotalTareasFinalizadas() > 0)
                                                .sorted(Comparator.comparingDouble(
                                                                TecnicoMetricaResponse::getTiempoPromedioHoras))
                                                .limit(5)
                                                .collect(Collectors.toList()));
        }

        public TecnicoMetricaResponse obtenerMetricasTecnico(String tecnicoId) {
                Usuario tecnico = usuarioRepository.findById(tecnicoId)
                                .orElseThrow(() -> new RuntimeException("Técnico no encontrado: " + tecnicoId));

                List<Tarea> tareas = tareaRepository.findByTecnicoId(tecnicoId);

                long activas = tareas.stream().filter(t -> t.getEstado() != EstadoTarea.FINALIZADA).count();
                long finalizadas = tareas.stream().filter(t -> t.getEstado() == EstadoTarea.FINALIZADA).count();
                double promedio = tareas.stream()
                                .filter(t -> t.getEstado() == EstadoTarea.FINALIZADA && t.getTiempoRealHoras() != null)
                                .mapToInt(Tarea::getTiempoRealHoras).average().orElse(0.0);

                return new TecnicoMetricaResponse(tecnico.getId(), tecnico.getNombre(), activas, finalizadas,
                                Math.round(promedio * 10.0) / 10.0);
        }

}
