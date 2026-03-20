package com.demo.tecmanager.controller;

import com.demo.tecmanager.dto.categoria.CategoriaRequest;
import com.demo.tecmanager.dto.categoria.CategoriaResponse;
import com.demo.tecmanager.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    // ── GET /api/categorias  (ADMIN + ASIGNADOR ven todas; TECNICO solo activas) ──
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ASIGNADOR','TECNICO')")
    public ResponseEntity<List<CategoriaResponse>> listar(Authentication auth) {
        boolean esAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                            || a.getAuthority().equals("ROLE_ASIGNADOR"));
        List<CategoriaResponse> lista = esAdmin
                ? service.listarTodas()
                : service.listarActivas();
        return ResponseEntity.ok(lista);
    }

    // ── GET /api/categorias/activas ──
    @GetMapping("/activas")
    @PreAuthorize("hasAnyRole('ADMIN','ASIGNADOR','TECNICO')")
    public ResponseEntity<List<CategoriaResponse>> listarActivas() {
        return ResponseEntity.ok(service.listarActivas());
    }

    // ── GET /api/categorias/{id} ──
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ASIGNADOR','TECNICO')")
    public ResponseEntity<CategoriaResponse> obtener(@PathVariable String id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    // ── POST /api/categorias  (solo ADMIN) ──
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoriaResponse> crear(
            @Valid @RequestBody CategoriaRequest req,
            Authentication auth) {
        CategoriaResponse creada = service.crear(req, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    // ── PUT /api/categorias/{id}  (solo ADMIN) ──
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoriaResponse> actualizar(
            @PathVariable String id,
            @Valid @RequestBody CategoriaRequest req) {
        return ResponseEntity.ok(service.actualizar(id, req));
    }

    // ── DELETE /api/categorias/{id}  (soft delete, solo ADMIN) ──
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable String id) {
        service.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    // ── PATCH /api/categorias/{id}/reactivar  (solo ADMIN) ──
    @PatchMapping("/{id}/reactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoriaResponse> reactivar(@PathVariable String id) {
        return ResponseEntity.ok(service.reactivar(id));
    }
}