package com.demo.tecmanager.dto.auth;

import com.demo.tecmanager.enums.Rol;

public class LoginResponse {

    private String token;
    private String tipo;
    private String id;
    private String nombre;
    private String email;
    private Rol rol;

    public LoginResponse() {}

    public LoginResponse(String token, String tipo, String id,
                         String nombre, String email, Rol rol) {
        this.token = token;
        this.tipo = tipo;
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }

    public String getToken() { return token; }
    public String getTipo() { return tipo; }
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public Rol getRol() { return rol; }

    public void setToken(String token) { this.token = token; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEmail(String email) { this.email = email; }
    public void setRol(Rol rol) { this.rol = rol; }
}
