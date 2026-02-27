package com.demo.tecmanager.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "notificaciones")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notificacion {

    @Id
    private String id;

    @Field("usuario_id")
    @NonNull
    private String usuarioId;

    @Field("mensaje")
    @NonNull
    private String mensaje;

    @Field("leida")
    @Builder.Default
    private boolean leida = false;

    @Field("fecha")
    @Builder.Default
    private LocalDateTime fecha = LocalDateTime.now();

}
