package com.demo.tecmanager.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "notificaciones")
public class Notificacion {

    @Id
    private String id;

    @Field("usuario_id")
    private String usuarioId;

    @Field("mensaje")
    private String mensaje;

    @Field("leida")
    private boolean leida = false;

    @Field("fecha")
    private LocalDateTime fecha = LocalDateTime.now();

    public Notificacion() {}

    public Notificacion(String usuarioId, String mensaje) {
        this.usuarioId = usuarioId;
        this.mensaje = mensaje;
        this.leida = false;
        this.fecha = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getUsuarioId() { return usuarioId; }
    public String getMensaje() { return mensaje; }
    public boolean isLeida() { return leida; }
    public LocalDateTime getFecha() { return fecha; }


    public void setId(String id) { this.id = id; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public void setLeida(boolean leida) { this.leida = leida; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

}
