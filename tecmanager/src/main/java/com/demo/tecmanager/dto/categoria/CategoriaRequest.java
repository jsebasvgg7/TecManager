package com.demo.tecmanager.dto.categoria;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CategoriaRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "Color debe ser hex válido (#RRGGBB)")
    private String color;

    private String icono;

    // SLA en horas — valores por defecto si no se envían
    @Min(value = 1, message = "SLA alta debe ser al menos 1 hora")
    private Integer slaAltaHoras = 4;

    @Min(value = 1, message = "SLA media debe ser al menos 1 hora")
    private Integer slaMediaHoras = 24;

    @Min(value = 1, message = "SLA baja debe ser al menos 1 hora")
    private Integer slaBajaHoras = 72;

    // ── Getters / Setters ──
    public String getNombre()          { return nombre; }
    public void   setNombre(String v)  { this.nombre = v; }

    public String getDescripcion()         { return descripcion; }
    public void   setDescripcion(String v) { this.descripcion = v; }

    public String getColor()          { return color; }
    public void   setColor(String v)  { this.color = v; }

    public String getIcono()          { return icono; }
    public void   setIcono(String v)  { this.icono = v; }

    public Integer getSlaAltaHoras()         { return slaAltaHoras; }
    public void    setSlaAltaHoras(Integer v){ this.slaAltaHoras = v; }

    public Integer getSlaMediaHoras()         { return slaMediaHoras; }
    public void    setSlaMediaHoras(Integer v){ this.slaMediaHoras = v; }

    public Integer getSlaBajaHoras()         { return slaBajaHoras; }
    public void    setSlaBajaHoras(Integer v){ this.slaBajaHoras = v; }
}