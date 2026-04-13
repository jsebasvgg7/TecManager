package com.demo.tecmanager.controller;

import com.demo.tecmanager.dto.tarea.CambioEstadoRequest;
import com.demo.tecmanager.dto.tarea.TareaRequest;
import com.demo.tecmanager.dto.tarea.TareaResponse;
import com.demo.tecmanager.service.TareaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService service;

    public TareaController(TareaService service) {
        this.service = service;
    }

    // ── GET /api/tareas ──
    // ADMIN y SUPERVISOR ven todas; TECNICO solo las suyas
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR','TECNICO')")
    public ResponseEntity<List<TareaResponse>> listar(Authentication auth) {
        boolean esPrivilegiado = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                            || a.getAuthority().equals("ROLE_SUPERVISOR"));

        List<TareaResponse> tareas = esPrivilegiado
                ? service.listarTodas()
                : service.listarPorTecnico(auth.getName());

        return ResponseEntity.ok(tareas);
    }

    // ── GET /api/tareas/mis-tareas  (TECNICO: solo las suyas) ──
    @GetMapping("/mis-tareas")
    @PreAuthorize("hasRole('TECNICO')")
    public ResponseEntity<List<TareaResponse>> misTareas(Authentication auth) {
        return ResponseEntity.ok(service.listarPorTecnico(auth.getName()));
    }

    // ── GET /api/tareas/categoria/{categoriaId} ──
    @GetMapping("/categoria/{categoriaId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR')")
    public ResponseEntity<List<TareaResponse>> porCategoria(@PathVariable String categoriaId) {
        return ResponseEntity.ok(service.listarPorCategoria(categoriaId));
    }

    // ── GET /api/tareas/{id} ──
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR','TECNICO')")
    public ResponseEntity<TareaResponse> obtener(@PathVariable String id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    // ── POST /api/tareas  (ADMIN + SUPERVISOR) ──
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR')")
    public ResponseEntity<TareaResponse> crear(
            @Valid @RequestBody TareaRequest req,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.crear(req, auth.getName()));
    }

    // ── PUT /api/tareas/{id}  (ADMIN + SUPERVISOR) ──
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR')")
    public ResponseEntity<TareaResponse> actualizar(
            @PathVariable String id,
            @Valid @RequestBody TareaRequest req,
            Authentication auth) {
        return ResponseEntity.ok(service.actualizar(id, req, auth.getName()));
    }

    // ── PATCH /api/tareas/{id}/estado  (todos los roles) ──
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR','TECNICO')")
    public ResponseEntity<TareaResponse> cambiarEstado(
            @PathVariable String id,
            @RequestBody CambioEstadoRequest req,
            Authentication auth) {
        return ResponseEntity.ok(service.cambiarEstado(id, req, auth.getName()));
    }

    // ── PATCH /api/tareas/{id}/avance  (TECNICO, ADMIN, SUPERVISOR) ──
    // Body: { "porcentaje": 60 }
    @PatchMapping("/{id}/avance")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR','TECNICO')")
    public ResponseEntity<TareaResponse> actualizarAvance(
            @PathVariable String id,
            @RequestBody Map<String, Integer> body,
            Authentication auth) {
        Integer porcentaje = body.get("porcentaje");
        if (porcentaje == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.actualizarAvance(id, porcentaje, auth.getName()));
    }

    // ── DELETE /api/tareas/{id}  (solo ADMIN) ──
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}