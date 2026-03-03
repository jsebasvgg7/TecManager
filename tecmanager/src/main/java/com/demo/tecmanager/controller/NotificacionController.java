package com.demo.tecmanager.controller;

import com.demo.tecmanager.document.Notificacion;
import com.demo.tecmanager.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    @Autowired
    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping("/mis-notificaciones")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notificacion>> misNotificaciones(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(notificacionService.obtenerPorUsuarioEmail(email));
    }

    @GetMapping("/no-leidas/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> contarNoLeidas(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(notificacionService.contarNoLeidasPorEmail(email));
    }

    @PatchMapping("/{id}/leer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> marcarComoLeida(@PathVariable String id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/leer-todas")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> marcarTodasComoLeidas(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        notificacionService.marcarTodasComoLeidasPorEmail(email);
        return ResponseEntity.noContent().build();
    }

}
