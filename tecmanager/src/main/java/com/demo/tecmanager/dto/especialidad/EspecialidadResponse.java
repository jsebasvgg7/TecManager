package com.demo.tecmanager.dto.especialidad;

import com.demo.tecmanager.document.Especialidad;
import java.time.LocalDateTime;

public class EspecialidadResponse {

    private String id;
    private String nombre;
    private String descripcion;
    private String color;
    private String icono;
    private boolean activa;
    private LocalDateTime fechaCreacion;
    private String creadaPor;

    public static EspecialidadResponse from(Especialidad e) {
        EspecialidadResponse r = new EspecialidadResponse();
        r.id           = e.getId();
        r.nombre       = e.getNombre();
        r.descripcion  = e.getDescripcion();
        r.color        = e.getColor();
        r.icono        = e.getIcono();
        r.activa       = e.isActiva();
        r.fechaCreacion = e.getFechaCreacion();
        r.creadaPor    = e.getCreadaPor();
        return r;
    }

    public String getId()                   { return id; }
    public String getNombre()               { return nombre; }
    public String getDescripcion()          { return descripcion; }
    public String getColor()                { return color; }
    public String getIcono()                { return icono; }
    public boolean isActiva()               { return activa; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public String getCreadaPor()            { return creadaPor; }
}
