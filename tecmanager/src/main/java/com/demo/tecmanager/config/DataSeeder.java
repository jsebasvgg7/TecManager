package com.demo.tecmanager.config;

import com.demo.tecmanager.document.Usuario;
import com.demo.tecmanager.enums.Rol;
import com.demo.tecmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!usuarioRepository.existsByEmail("admin@sistema.com")) {
            Usuario admin = new Usuario("Administrador", "admin@sistema.com", passwordEncoder.encode("Admin1234"), Rol.ADMIN);
            usuarioRepository.save(admin);
            System.out.println("Usuario administrador creado: admin@sistema.com / Admin1234");
        } else {
            System.out.println("Usuario administrador ya existe.");
        }
    }

}
