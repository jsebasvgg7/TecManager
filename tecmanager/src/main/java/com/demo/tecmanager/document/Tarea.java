package com.demo.tecmanager.document;

import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "tareas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tarea {

    @Id
    private String id; 

    @Field("titulo")
    @NonNull
    private String titulo;

    @Field("descripcion")
    private String descripcion;

    @Field("prioridad")
    @Builder.Default
    private Prioridad prioridad = Prioridad.MEDIA;

    @Field("estado")
    @Builder.Default
    private EstadoTarea estado = EstadoTarea.PENDIENTE;

    @Field("tecnico_id")
    private String tecnicoId;

    @Field("creada_por")
    private String creadaPor;

    @Field("fecha_creacion")
    @Builder.Default
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Field("fecha_limite")
    private LocalDateTime fechaLimite;

    @Field("tiempo_estimado_horas")
    private Integer tiempoEstimadoHoras;

    @Field("tiempo_real_horas")
    private Integer tiempoRealHoras;

    @Field("fecha_inicio")
    private LocalDateTime fechaInicio;

    @Field("fecha_inicio_proceso")
    private LocalDateTime fechaInicioProceso;

    @Field("fecha_finalizacion")
    private LocalDateTime fechaFinalizacion;
}
