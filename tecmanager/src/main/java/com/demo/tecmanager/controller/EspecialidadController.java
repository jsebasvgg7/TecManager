package com.demo.tecmanager.controller;

import com.demo.tecmanager.dto.especialidad.EspecialidadRequest;
import com.demo.tecmanager.dto.especialidad.EspecialidadResponse;
import com.demo.tecmanager.service.EspecialidadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/especialidades")
public class EspecialidadController {

    @Autowired
    private EspecialidadService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<List<EspecialidadResponse>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/activas")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR', 'TECNICO')")
    public ResponseEntity<List<EspecialidadResponse>> listarActivas() {
        return ResponseEntity.ok(service.listarActivas());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<EspecialidadResponse> obtener(@PathVariable String id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EspecialidadResponse> crear(
            @Valid @RequestBody EspecialidadRequest req,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.crear(req, auth.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EspecialidadResponse> actualizar(
            @PathVariable String id,
            @Valid @RequestBody EspecialidadRequest req) {
        return ResponseEntity.ok(service.actualizar(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable String id) {
        service.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EspecialidadResponse> reactivar(@PathVariable String id) {
        return ResponseEntity.ok(service.reactivar(id));
    }

    @PutMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> asignar(
            @PathVariable String usuarioId,
            @RequestBody List<String> especialidadIds) {
        service.asignarEspecialidades(usuarioId, especialidadIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<List<EspecialidadResponse>> obtenerDeUsuario(
            @PathVariable String usuarioId) {
        return ResponseEntity.ok(service.obtenerDeUsuario(usuarioId));
    }
}
