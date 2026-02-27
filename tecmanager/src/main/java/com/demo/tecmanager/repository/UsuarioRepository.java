package com.demo.tecmanager.repository;

import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.enums.Rol;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findByRol(Rol rol);

    List<Usuario> findByActivoTrue();

    List<Usuario> findByNombreContainingIgnoreCase(String nombre);

}
