package com.demo.tecmanager.dto.categoria;

import com.demo.tecmanager.document.Categoria;

import java.time.LocalDateTime;

public class CategoriaResponse {

    private String id;
    private String nombre;
    private String descripcion;
    private String color;
    private String icono;
    private boolean activa;
    private Integer slaAltaHoras;
    private Integer slaMediaHoras;
    private Integer slaBajaHoras;
    private LocalDateTime fechaCreacion;
    private String creadaPor;

    // ── Constructor desde documento ──
    public static CategoriaResponse from(Categoria c) {
        CategoriaResponse r = new CategoriaResponse();
        r.id             = c.getId();
        r.nombre         = c.getNombre();
        r.descripcion    = c.getDescripcion();
        r.color          = c.getColor();
        r.icono          = c.getIcono();
        r.activa         = c.isActiva();
        r.slaAltaHoras   = c.getSlaAltaHoras();
        r.slaMediaHoras  = c.getSlaMediaHoras();
        r.slaBajaHoras   = c.getSlaBajaHoras();
        r.fechaCreacion  = c.getFechaCreacion();
        r.creadaPor      = c.getCreadaPor();
        return r;
    }

    // ── Getters ──
    public String getId()                       { return id; }
    public String getNombre()                   { return nombre; }
    public String getDescripcion()              { return descripcion; }
    public String getColor()                    { return color; }
    public String getIcono()                    { return icono; }
    public boolean isActiva()                   { return activa; }
    public Integer getSlaAltaHoras()            { return slaAltaHoras; }
    public Integer getSlaMediaHoras()           { return slaMediaHoras; }
    public Integer getSlaBajaHoras()            { return slaBajaHoras; }
    public LocalDateTime getFechaCreacion()     { return fechaCreacion; }
    public String getCreadaPor()                { return creadaPor; }
}