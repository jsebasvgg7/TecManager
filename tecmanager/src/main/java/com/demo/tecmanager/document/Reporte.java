package com.demo.tecmanager.document;

import com.demo.tecmanager.enums.EstadoTarea;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "reportes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reporte {

    @Id
    private String id;

    @Field("tarea_id")
    @NonNull
    private String tareaId;

    @Field("tecnico_id")
    @NonNull
    private String tecnicoId;

    @Field("comentario")
    @NonNull
    private String comentario;

    @Field("estado_final")
    @NonNull
    private EstadoTarea estadoFinal;

    @Field("fecha")
    @Builder.Default
    private LocalDateTime fecha = LocalDateTime.now();

}
