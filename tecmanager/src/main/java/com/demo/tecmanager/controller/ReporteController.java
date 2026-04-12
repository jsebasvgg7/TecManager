package com.demo.tecmanager.controller;

import com.demo.tecmanager.document.Reporte;
import com.demo.tecmanager.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    @Autowired
    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Reporte>> obtenerTodos() {
        return ResponseEntity.ok(reporteService.obtenerTodos());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<Reporte> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(reporteService.obtenerPorId(id));
    }

    @GetMapping("/tarea/{tareaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<Reporte>> obtenerPorTarea(@PathVariable String tareaId) {
        return ResponseEntity.ok(reporteService.obtenerPorTarea(tareaId));
    }

    @GetMapping("/tecnico/{tecnicoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<Reporte>> obtenerPorTecnico(@PathVariable String tecnicoId) {
        return ResponseEntity.ok(reporteService.obtenerPorTecnico(tecnicoId));
    }

}
