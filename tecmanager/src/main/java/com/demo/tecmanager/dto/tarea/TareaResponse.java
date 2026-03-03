package com.demo.tecmanager.dto.tarea;

import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;

import java.time.LocalDateTime;

public class TareaResponse {

    private String id;
    private String titulo;
    private String descripcion;
    private Prioridad prioridad;
    private EstadoTarea estado;
    private String tecnicoId;
    private String tecnicoNombre;
    private String creadaPor;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaLimite;
    private Integer tiempoEstimadoHoras;
    private Integer tiempoRealHoras;
    private boolean vencida;

    public TareaResponse() {}

    public String getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public Prioridad getPrioridad() { return prioridad; }
    public EstadoTarea getEstado() { return estado; }
    public String getTecnicoId() { return tecnicoId; }
    public String getTecnicoNombre() { return tecnicoNombre; }
    public String getCreadaPor() { return creadaPor; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaLimite() { return fechaLimite; }
    public Integer getTiempoEstimadoHoras() { return tiempoEstimadoHoras; }
    public Integer getTiempoRealHoras() { return tiempoRealHoras; }
    public boolean isVencida() { return vencida; }


    public void setId(String id) { this.id = id; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }
    public void setEstado(EstadoTarea estado) { this.estado = estado; }
    public void setTecnicoId(String tecnicoId) { this.tecnicoId = tecnicoId; }
    public void setTecnicoNombre(String tecnicoNombre) { this.tecnicoNombre = tecnicoNombre; }
    public void setCreadaPor(String creadaPor) { this.creadaPor = creadaPor; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public void setFechaLimite(LocalDateTime fechaLimite) { this.fechaLimite = fechaLimite; }
    public void setTiempoEstimadoHoras(Integer tiempoEstimadoHoras) { this.tiempoEstimadoHoras = tiempoEstimadoHoras; }
    public void setTiempoRealHoras(Integer tiempoRealHoras) { this.tiempoRealHoras = tiempoRealHoras; }
    public void setVencida(boolean vencida) { this.vencida = vencida; }

}
