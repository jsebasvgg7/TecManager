package com.demo.tecmanager.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "especialidades")
public class Especialidad {

    @Id
    private String id;

    @Field("nombre")
    private String nombre;

    @Field("descripcion")
    private String descripcion;

    @Field("color")
    private String color = "#3b82f6";

    @Field("icono")
    private String icono = "Wrench";

    @Field("activa")
    private boolean activa = true;

    @Field("fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Field("creada_por")
    private String creadaPor;

    public Especialidad() {}

    public Especialidad(String nombre, String descripcion,
                        String color, String icono, String creadaPor) {
        this.nombre       = nombre;
        this.descripcion  = descripcion;
        this.color        = color;
        this.icono        = icono;
        this.creadaPor    = creadaPor;
        this.activa       = true;
        this.fechaCreacion = LocalDateTime.now();
    }

    public String getId()                    { return id; }
    public String getNombre()                { return nombre; }
    public String getDescripcion()           { return descripcion; }
    public String getColor()                 { return color; }
    public String getIcono()                 { return icono; }
    public boolean isActiva()                { return activa; }
    public LocalDateTime getFechaCreacion()  { return fechaCreacion; }
    public String getCreadaPor()             { return creadaPor; }

    public void setId(String id)                      { this.id = id; }
    public void setNombre(String nombre)              { this.nombre = nombre; }
    public void setDescripcion(String descripcion)    { this.descripcion = descripcion; }
    public void setColor(String color)                { this.color = color; }
    public void setIcono(String icono)                { this.icono = icono; }
    public void setActiva(boolean activa)             { this.activa = activa; }
    public void setFechaCreacion(LocalDateTime f)     { this.fechaCreacion = f; }
    public void setCreadaPor(String creadaPor)        { this.creadaPor = creadaPor; }
}