package com.demo.tecmanager.controller;

import com.demo.tecmanager.document.Tarea;
import com.demo.tecmanager.dto.tarea.CambioEstadoRequest;
import com.demo.tecmanager.dto.tarea.TareaRequest;
import com.demo.tecmanager.dto.tarea.TareaResponse;
import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import com.demo.tecmanager.service.TareaService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.apache.catalina.connector.Response;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService tareaService;

    @Autowired
    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<TareaResponse> crear(@Valid @RequestBody TareaRequest request, Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.status(HttpStatus.CREATED).body(tareaService.crear(request, email));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<List<TareaResponse>> listarTodas() {
        return ResponseEntity.ok(tareaService.listarTodas());
    }

    @GetMapping("/mis-tareas")
    @PreAuthorize("hasRole('TECNICO')")
        public ResponseEntity<List<Tarea>> misTareas(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(tareaService.obtenerMisTareas(email));
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<List<TareaResponse>> listarPorEstado(@PathVariable EstadoTarea estado) {
        return ResponseEntity.ok(tareaService.listarPorEstado(estado));
    }

    @GetMapping("/prioridad/{prioridad}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<List<TareaResponse>> listarPorPrioridad(@PathVariable Prioridad prioridad) {
        return ResponseEntity.ok(tareaService.listarPorPrioridad(prioridad));
    }

    @GetMapping("/vencidas")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<List<TareaResponse>> listarVencidas() {
        return ResponseEntity.ok(tareaService.listarVencidas());
    }

    @GetMapping("/buscar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TareaResponse>> buscar(@RequestParam String titulo) {
        return ResponseEntity.ok(tareaService.buscarPorTitulo(titulo));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TareaResponse> obtenerPorId(@PathVariable String id) {
        return ResponseEntity.ok(tareaService.obtenerPorId(id));
    } 

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<TareaResponse> editar(@PathVariable String id, @Valid @RequestBody TareaRequest request, Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(tareaService.editar(id, request, email));
    }

    @GetMapping("/{id}/asignar")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<TareaResponse> asignarTecnico(@PathVariable String id, @RequestParam String tecnicoId, Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(tareaService.asignarTecnico(id, tecnicoId, email));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('TECNICO', 'ADMIN')")
    public ResponseEntity<TareaResponse> cambiarEstado(
            @PathVariable String id,
            @Valid @RequestBody CambioEstadoRequest request,
            Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(tareaService.cambiarEstado(id, request, email));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ASIGNADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        tareaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
