package com.demo.tecmanager.service;

import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.dto.usuario.UsuarioRequest;
import com.demo.tecmanager.dto.usuario.UsuarioResponse;
import com.demo.tecmanager.enums.Rol;
import com.demo.tecmanager.exception.ResourceNotFoundException;
import com.demo.tecmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponse crear(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("ya existe un usuario con el email: " + request.getEmail());
        }

        Usuario usuario = new Usuario(request.getNombre(),
                                      request.getEmail(),
                                      passwordEncoder.encode(request.getPassword()),
                                      request.getRol()
                                    );

        Usuario guardado = usuarioRepository.save(usuario);
        return toResponse(guardado);
    }

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<UsuarioResponse> listarPorRol(Rol rol) {
        return usuarioRepository.findByRol(rol).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<UsuarioResponse> listarActivos() {
        return usuarioRepository.findByActivoTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<UsuarioResponse> buscarPorNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UsuarioResponse obtenerPorId(String id) {
        Usuario usuario = buscarPorIdOFallar(id);
        return toResponse(usuario);
    }

    public UsuarioResponse editar(String id, UsuarioRequest request) {
        Usuario usuario = buscarPorIdOFallar(id);

        if (!usuario.getEmail().equals(request.getEmail()) && usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("ya existe un usuario con el email: " + request.getEmail());
        }

        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setRol(request.getRol());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toResponse(usuarioRepository.save(usuario));
    }

    public UsuarioResponse cambiarRol(String id, Rol nuevoRol) {
        Usuario usuario = buscarPorIdOFallar(id);
        usuario.setRol(nuevoRol);
        return toResponse(usuarioRepository.save(usuario));
    }

    public UsuarioResponse cambiarEstado(String id) {
        Usuario usuario = buscarPorIdOFallar(id);
        usuario.setActivo(!usuario.isActivo());
        return toResponse(usuarioRepository.save(usuario));
    }

    public void eliminar(String id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    private Usuario buscarPorIdOFallar(String id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol(), usuario.isActivo(), usuario.getFechaCreacion());
    }

}
