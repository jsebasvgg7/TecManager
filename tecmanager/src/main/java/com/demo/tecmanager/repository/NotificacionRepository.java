package com.demo.tecmanager.repository;

import com.demo.tecmanager.document.Notificacion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificacionRepository extends MongoRepository<Notificacion, String> {

    List<Notificacion> findByUsuarioId(String usuarioId);

    List<Notificacion> findByUsuarioIdAndLeidaFalse(String usuarioId);

    long countByUsuarioIdAndLeidaFalse(String usuarioId);
}
