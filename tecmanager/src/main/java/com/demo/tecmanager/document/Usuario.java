package com.demo.tecmanager.document;

import com.demo.tecmanager.enums.Rol;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "usuarios")
public class Usuario {

    @Id
    private String id;

    @Field("nombre")
    private String nombre;

    @Indexed(unique = true)
    @Field("email")
    private String email;

    @Field("password")
    private String password;

    @Field("rol")
    private Rol rol = Rol.TECNICO;

    @Field("activo")
    private boolean activo = true;

    @Field("fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Field("especialidad_ids")
    private List<String> especialidadIds = new ArrayList<>();

    public Usuario() {}

    public Usuario(String nombre, String email, String password, Rol rol) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.activo = true;
        this.fechaCreacion = LocalDateTime.now();
    }


    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Rol getRol() { return rol; }
    public boolean isActivo() { return activo; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public List<String> getEspecialidadIds() { return especialidadIds; }


    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRol(Rol rol) { this.rol = rol; }
    public void setActivo(boolean activo) { this.activo = activo; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public void setEspecialidadIds(List<String> ids) { this.especialidadIds = ids; }
}