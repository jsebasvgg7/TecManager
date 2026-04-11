package com.demo.tecmanager.dto.especialidad;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class EspecialidadRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "Color debe ser hex válido")
    private String color = "#3b82f6";

    private String icono = "Wrench";

    public String getNombre()           { return nombre; }
    public void   setNombre(String v)   { this.nombre = v; }

    public String getDescripcion()          { return descripcion; }
    public void   setDescripcion(String v)  { this.descripcion = v; }

    public String getColor()            { return color; }
    public void   setColor(String v)    { this.color = v; }

    public String getIcono()            { return icono; }
    public void   setIcono(String v)    { this.icono = v; }
}
