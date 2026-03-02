package com.demo.tecmanager.dto.usuario;

import com.demo.tecmanager.enums.Rol;
import java.time.LocalDateTime;

public class UsuarioResponse {

    private String id;
    private String nombre;
    private String email;
    private Rol rol;
    private boolean activo;
    private LocalDateTime fechaCreacion;

    public UsuarioResponse() {}

    public UsuarioResponse(String id, String nombre, String email, Rol rol, boolean activo, LocalDateTime fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.activo = activo;
        this.fechaCreacion = fechaCreacion;
    }

    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public Rol getRol() { return rol; }
    public boolean isActivo() { return activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }

    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEmail(String email) { this.email = email; }
    public void setRol(Rol rol) { this.rol = rol; }
    public void setActivo(boolean activo) { this.activo = activo; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

}
