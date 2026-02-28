package com.demo.tecmanager.document;

import com.demo.tecmanager.enums.AccionHistorial;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;


@Document(collection = "historial_cambio")
public class HistorialCambio {

    @Id
    private String id;

    @Field("tarea_id")
    private String tareaId;

    @Field("usuario_id")
    private String usuarioId;

    @Field("accion")
    private AccionHistorial accion;

    @Field("valor_anterior")
    private String valorAnterior;

    @Field("valor_nuevo")
    private String valorNuevo;

    @Field("fecha")
    private LocalDateTime fecha = LocalDateTime.now();


    public HistorialCambio() {}

    public HistorialCambio(String tareaId, String usuarioId, AccionHistorial accion,
                           String valorAnterior, String valorNuevo) {
        this.tareaId = tareaId;
        this.usuarioId = usuarioId;
        this.accion = accion;
        this.valorAnterior = valorAnterior;
        this.valorNuevo = valorNuevo;
        this.fecha = LocalDateTime.now();
    }


    public String getId() { return id; }
    public String getTareaId() { return tareaId; }
    public String getUsuarioId() { return usuarioId; }
    public AccionHistorial getAccion() { return accion; }
    public String getValorAnterior() { return valorAnterior; }
    public String getValorNuevo() { return valorNuevo; }
    public LocalDateTime getFecha() { return fecha; }


    public void setId(String id) { this.id = id; }
    public void setTareaId(String tareaId) { this.tareaId = tareaId; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }
    public void setAccion(AccionHistorial accion) { this.accion = accion; }
    public void setValorAnterior(String valorAnterior) { this.valorAnterior = valorAnterior; }
    public void setValorNuevo(String valorNuevo) { this.valorNuevo = valorNuevo; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}
