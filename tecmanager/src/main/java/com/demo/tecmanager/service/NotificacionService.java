package com.demo.tecmanager.service;

import com.demo.tecmanager.document.Notificacion;
import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.exception.ResourceNotFoundException;
import com.demo.tecmanager.repository.NotificacionRepository;
import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.demo.tecmanager.repository.UsuarioRepository;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public NotificacionService(NotificacionRepository notificacionRepository, UsuarioRepository usuarioRepository) {
    this.notificacionRepository = notificacionRepository;
    this.usuarioRepository = usuarioRepository;
}

    public void notificar(String usuarioId, String mensaje) {
        Notificacion notificacion = new Notificacion(usuarioId, mensaje);
        notificacionRepository.save(notificacion);
    }

    public List<Notificacion> obtenerPorUsuario(String usuarioId) {
        return notificacionRepository.findByUsuarioId(usuarioId);
    }

    public List<Notificacion> obtenerPorUsuarioEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));
        return notificacionRepository.findByUsuarioId(usuario.getId());
    }

    public List<Notificacion> obtenerNoLeidas(String usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidaFalse(usuarioId);
    }

    public long contarNoLeidas(String usuarioId) {
        return notificacionRepository.countByUsuarioIdAndLeidaFalse(usuarioId);
    }

    public long contarNoLeidasPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));
        return notificacionRepository.countByUsuarioIdAndLeidaFalse(usuario.getId());
    }

    public void marcarComoLeida(String notificacionId) {
        notificacionRepository.findById(notificacionId).ifPresent(n -> {
            n.setLeida(true);
            notificacionRepository.save(n);
        });
    }

    public void marcarTodasComoLeidas(String usuarioId) {
        List<Notificacion> noLeidas = notificacionRepository.findByUsuarioIdAndLeidaFalse(usuarioId);
        noLeidas.forEach(n -> n.setLeida(true));
        notificacionRepository.saveAll(noLeidas);
    }

    public void marcarTodasComoLeidasPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));
        marcarTodasComoLeidas(usuario.getId());
    }

}
