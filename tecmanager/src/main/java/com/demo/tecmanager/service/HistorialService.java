package com.demo.tecmanager.service;

import com.demo.tecmanager.document.HistorialCambio;
import com.demo.tecmanager.enums.AccionHistorial;
import com.demo.tecmanager.repository.HistorialCambioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistorialService {

    private final HistorialCambioRepository historialCambioRepository;

    @Autowired
    public HistorialService(HistorialCambioRepository historialCambioRepository) {
        this.historialCambioRepository = historialCambioRepository;
    }

    public void registrar(String tareaId, String usuarioId, AccionHistorial accion, String valorAnterior, String valorNuevo) {
        HistorialCambio cambio = new HistorialCambio(tareaId, usuarioId, accion, valorAnterior, valorNuevo);
        historialCambioRepository.save(cambio);
    }

    public List<HistorialCambio> obtenerPorTarea(String tareaId) {
        return historialCambioRepository.findByTareaIdOrderByFechaDesc(tareaId);
    }

    public List<HistorialCambio> obtenerPorUsuario(String usuarioId) {
        return historialCambioRepository.findByUsuarioId(usuarioId);
    }

}
