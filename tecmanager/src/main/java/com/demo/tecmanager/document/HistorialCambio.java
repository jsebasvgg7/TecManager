package com.demo.tecmanager.document;

import com.demo.tecmanager.enums.AccionHistorial;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;


@Document(collection = "historial_cambio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialCambio {

    @Id
    private String id;

    @Field("tarea_id")
    @NonNull
    private String tareaId;

    @Field("usuario_id")
    @NonNull
    private String usuarioId;

    @Field("accion")
    @NonNull
    private AccionHistorial accion;

    @Field("valor_anterior")
    private String valorAnterior;

    @Field("valor_nuevo")
    private String valorNuevo;

    @Field("fecha")
    @Builder.Default
    private LocalDateTime fecha = LocalDateTime.now();

}
