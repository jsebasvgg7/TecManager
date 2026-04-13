package com.demo.tecmanager.controller;

import com.demo.tecmanager.document.HistorialCambio;
import com.demo.tecmanager.service.HistorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
public class HistorialController {

    private final HistorialService historialService;

    @Autowired
    public HistorialController(HistorialService historialService) {
        this.historialService = historialService;
    }

    @GetMapping("/tarea/{tareaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<HistorialCambio>> obtenerPorTarea(@PathVariable String tareaId) {
        return ResponseEntity.ok(historialService.obtenerPorTarea(tareaId));
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HistorialCambio>> porUsuario(@PathVariable String usuarioId) {
        return ResponseEntity.ok(historialService.obtenerPorUsuario(usuarioId));
    }

}
