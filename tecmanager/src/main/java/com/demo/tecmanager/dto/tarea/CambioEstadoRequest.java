package com.demo.tecmanager.dto.tarea;

import com.demo.tecmanager.enums.EstadoTarea;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CambioEstadoRequest {

    @NotNull(message = "el nuevo estado es obligatorio")
    private EstadoTarea nuevoEstado;

    @NotBlank(message = "el comentario es obligatorio al cambiar de estado")
    private String comentario;

    public CambioEstadoRequest() {}

    public EstadoTarea getNuevoEstado() { return nuevoEstado; }
    public String getComentario() { return comentario; }

    public void setNuevoEstado(EstadoTarea nuevoEstado) { this.nuevoEstado = nuevoEstado; }
    public void setComentario(String comentario) { this.comentario = comentario; }

}
