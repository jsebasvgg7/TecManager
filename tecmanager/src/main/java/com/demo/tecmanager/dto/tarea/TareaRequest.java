package com.demo.tecmanager.dto.tarea;

import com.demo.tecmanager.enums.Prioridad;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class TareaRequest {

    @NotBlank(message = "el titulo es obligatorio")
    private String titulo;

    private String descripcion;

    @NotNull(message = "la prioridad es obligatoria")
    private Prioridad prioridad;

    private String tecnicoId;

    @NotNull(message = "la fecha limite es obligatoria")
    @Future(message = "la fecha limite debe ser futura")
    private LocalDateTime fechaLimite;

    private Integer tiempoEstimadoHoras;

    public TareaRequest() {}

    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public Prioridad getPrioridad() { return prioridad; }
    public String getTecnicoId() { return tecnicoId; }
    public LocalDateTime getFechaLimite() { return fechaLimite; }
    public Integer getTiempoEstimadoHoras() { return tiempoEstimadoHoras; }


    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setPrioridad(Prioridad prioridad) { this.prioridad = prioridad; }
    public void setTecnicoId(String tecnicoId) { this.tecnicoId = tecnicoId; }
    public void setFechaLimite(LocalDateTime fechaLimite) { this.fechaLimite = fechaLimite; }
    public void setTiempoEstimadoHoras(Integer tiempoEstimadoHoras) { this.tiempoEstimadoHoras = tiempoEstimadoHoras; }

}
