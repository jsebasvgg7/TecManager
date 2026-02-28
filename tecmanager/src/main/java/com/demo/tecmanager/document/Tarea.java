package com.demo.tecmanager.document;

import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "tareas")
public class Tarea {

    @Id
    private String id;

    @Field("titulo")
    private String titulo;

    @Field("descripcion")
    private String descripcion;

    @Field("prioridad")
    private Prioridad prioridad = Prioridad.MEDIA;

    @Field("estado")
    private EstadoTarea estado = EstadoTarea.PENDIENTE;

    @Field("tecnico_id")
    private String tecnicoId;

    @Field("creada_por")
    private String creadaPor;

    @Field("fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Field("fecha_limite")
    private LocalDateTime fechaLimite;

    @Field("tiempo_estimado_horas")
    private Integer tiempoEstimadoHoras;

    @Field("tiempo_real_horas")
    private Integer tiempoRealHoras;

    @Field("fecha_inicio_proceso")
    private LocalDateTime fechaInicioProceso;

    @Field("fecha_finalizacion")
    private LocalDateTime fechaFinalizacion;


    public Tarea() {}

    public Tarea(String titulo, String descripcion, Prioridad prioridad,
                 String tecnicoId, String creadaPor, LocalDateTime fechaLimite,
                 Integer tiempoEstimadoHoras) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.estado = EstadoTarea.PENDIENTE;
        this.tecnicoId = tecnicoId;
        this.creadaPor = creadaPor;
        this.fechaCreacion = LocalDateTime.now();
        this.fechaLimite = fechaLimite;
        this.tiempoEstimadoHoras = tiempoEstimadoHoras;
    }


    public String getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public Prioridad getPrioridad() { return prioridad; }
    public EstadoTarea getEstado() { return estado; }
    public String getTecnicoId() { return tecnicoId; }
    public String getCreadaPor() { return creadaPor; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaLimite() { return fechaLimite; }
    public Integer getTiempoEstimadoHoras() { return tiempoEstimadoHoras; }
    public Integer getTiempoRealHoras() { return tiempoRealHoras; }
    public LocalDateTime getFechaInicioProceso() { return fechaInicioProceso; }
    public LocalDateTime getFechaFinalizacion() { return fechaFinalizacion; }


    public void setId(String id) { this.id = id; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }
    public void setEstado(EstadoTarea estado) { this.estado = estado; }
    public void setTecnicoId(String tecnicoId) { this.tecnicoId = tecnicoId; }
    public void setCreadaPor(String creadaPor) { this.creadaPor = creadaPor; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public void setFechaLimite(LocalDateTime fechaLimite) { this.fechaLimite = fechaLimite; }
    public void setTiempoEstimadoHoras(Integer tiempoEstimadoHoras) { this.tiempoEstimadoHoras = tiempoEstimadoHoras; }
    public void setTiempoRealHoras(Integer tiempoRealHoras) { this.tiempoRealHoras = tiempoRealHoras; }
    public void setFechaInicioProceso(LocalDateTime fechaInicioProceso) { this.fechaInicioProceso = fechaInicioProceso; }
    public void setFechaFinalizacion(LocalDateTime fechaFinalizacion) { this.fechaFinalizacion = fechaFinalizacion; }
}
