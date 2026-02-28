package com.demo.tecmanager.document;

import com.demo.tecmanager.enums.EstadoTarea;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "reportes")
public class Reporte {

    @Id
    private String id;

    @Field("tarea_id")
    private String tareaId;

    @Field("tecnico_id")
    private String tecnicoId;

    @Field("comentario")
    private String comentario;

    @Field("estado_final")
    private EstadoTarea estadoFinal;

    @Field("fecha")
    private LocalDateTime fecha = LocalDateTime.now();


    public Reporte() {}

    public Reporte(String tareaId, String tecnicoId,
                   String comentario, EstadoTarea estadoFinal) {
        this.tareaId = tareaId;
        this.tecnicoId = tecnicoId;
        this.comentario = comentario;
        this.estadoFinal = estadoFinal;
        this.fecha = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getTareaId() { return tareaId; }
    public String getTecnicoId() { return tecnicoId; }
    public String getComentario() { return comentario; }
    public EstadoTarea getEstadoFinal() { return estadoFinal; }
    public LocalDateTime getFecha() { return fecha; }


    public void setId(String id) { this.id = id; }
    public void setTareaId(String tareaId) { this.tareaId = tareaId; }
    public void setTecnicoId(String tecnicoId) { this.tecnicoId = tecnicoId; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public void setEstadoFinal(EstadoTarea estadoFinal) { this.estadoFinal = estadoFinal; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

}
