package com.demo.tecmanager.service;

import com.demo.tecmanager.document.Especialidad;
import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.dto.especialidad.EspecialidadRequest;
import com.demo.tecmanager.dto.especialidad.EspecialidadResponse;
import com.demo.tecmanager.repository.EspecialidadRepository;
import com.demo.tecmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EspecialidadService {

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<EspecialidadResponse> listarTodas() {
        return especialidadRepository.findAll()
                .stream().map(EspecialidadResponse::from).collect(Collectors.toList());
    }

    public List<EspecialidadResponse> listarActivas() {
        return especialidadRepository.findByActivaTrue()
                .stream().map(EspecialidadResponse::from).collect(Collectors.toList());
    }

    public EspecialidadResponse obtenerPorId(String id) {
        Especialidad e = especialidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));
        return EspecialidadResponse.from(e);
    }

    public EspecialidadResponse crear(EspecialidadRequest req, String emailCreador) {
        if (especialidadRepository.existsByNombreIgnoreCase(req.getNombre())) {
            throw new RuntimeException("Ya existe una especialidad con ese nombre");
        }
        Especialidad e = new Especialidad(
                req.getNombre(), req.getDescripcion(),
                req.getColor(), req.getIcono(), emailCreador
        );
        return EspecialidadResponse.from(especialidadRepository.save(e));
    }

    public EspecialidadResponse actualizar(String id, EspecialidadRequest req) {
        Especialidad e = especialidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));

        if (especialidadRepository.existsByNombreIgnoreCaseAndIdNot(req.getNombre(), id)) {
            throw new RuntimeException("Ya existe una especialidad con ese nombre");
        }

        e.setNombre(req.getNombre());
        e.setDescripcion(req.getDescripcion());
        if (req.getColor() != null) e.setColor(req.getColor());
        if (req.getIcono() != null) e.setIcono(req.getIcono());

        return EspecialidadResponse.from(especialidadRepository.save(e));
    }

    public void desactivar(String id) {
        Especialidad e = especialidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));
        e.setActiva(false);
        especialidadRepository.save(e);
    }

    public EspecialidadResponse reactivar(String id) {
        Especialidad e = especialidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialidad no encontrada"));
        e.setActiva(true);
        return EspecialidadResponse.from(especialidadRepository.save(e));
    }

    public void asignarEspecialidades(String usuarioId, List<String> especialidadIds) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<String> idsValidos = especialidadIds.stream()
                .filter(eid -> especialidadRepository.findById(eid)
                        .map(Especialidad::isActiva).orElse(false))
                .collect(Collectors.toList());

        usuario.setEspecialidadIds(idsValidos);
        usuarioRepository.save(usuario);
    }

    public List<EspecialidadResponse> obtenerDeUsuario(String usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getEspecialidadIds() == null || usuario.getEspecialidadIds().isEmpty()) {
            return new ArrayList<>();
        }

        return usuario.getEspecialidadIds().stream()
                .map(eid -> especialidadRepository.findById(eid)
                        .map(EspecialidadResponse::from).orElse(null))
                .filter(e -> e != null)
                .collect(Collectors.toList());
    }
}