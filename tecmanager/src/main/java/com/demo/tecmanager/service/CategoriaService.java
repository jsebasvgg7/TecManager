package com.demo.tecmanager.service;

import com.demo.tecmanager.document.Categoria;
import com.demo.tecmanager.dto.categoria.CategoriaRequest;
import com.demo.tecmanager.dto.categoria.CategoriaResponse;
import com.demo.tecmanager.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository repo;

    public CategoriaService(CategoriaRepository repo) {
        this.repo = repo;
    }

    // ── Listar solo activas (uso general) ──
    public List<CategoriaResponse> listarActivas() {
        return repo.findByActivaTrue()
                   .stream()
                   .map(CategoriaResponse::from)
                   .collect(Collectors.toList());
    }

    // ── Listar todas (solo ADMIN) ──
    public List<CategoriaResponse> listarTodas() {
        return repo.findAll()
                   .stream()
                   .map(CategoriaResponse::from)
                   .collect(Collectors.toList());
    }

    // ── Obtener por ID ──
    public CategoriaResponse obtenerPorId(String id) {
        Categoria cat = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id));
        return CategoriaResponse.from(cat);
    }

    // ── Crear ──
    public CategoriaResponse crear(CategoriaRequest req, String creadaPor) {
        if (repo.findByNombreIgnoreCase(req.getNombre()).isPresent()) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        Categoria cat = new Categoria(
                req.getNombre(),
                req.getDescripcion(),
                req.getColor() != null ? req.getColor() : "#6366f1",
                req.getIcono() != null ? req.getIcono() : "Tag",
                creadaPor
        );
        cat.setSlaAltaHoras (req.getSlaAltaHoras()  != null ? req.getSlaAltaHoras()  : 4);
        cat.setSlaMediaHoras(req.getSlaMediaHoras() != null ? req.getSlaMediaHoras() : 24);
        cat.setSlaBajaHoras (req.getSlaBajaHoras()  != null ? req.getSlaBajaHoras()  : 72);

        return CategoriaResponse.from(repo.save(cat));
    }

    // ── Actualizar ──
    public CategoriaResponse actualizar(String id, CategoriaRequest req) {
        Categoria cat = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id));

        // Validar nombre único (excluyendo la misma)
        if (repo.existsByNombreIgnoreCaseAndIdNot(req.getNombre(), id)) {
            throw new RuntimeException("Ya existe otra categoría con ese nombre");
        }

        cat.setNombre     (req.getNombre());
        cat.setDescripcion(req.getDescripcion());
        if (req.getColor() != null) cat.setColor(req.getColor());
        if (req.getIcono() != null) cat.setIcono(req.getIcono());
        if (req.getSlaAltaHoras()  != null) cat.setSlaAltaHoras (req.getSlaAltaHoras());
        if (req.getSlaMediaHoras() != null) cat.setSlaMediaHoras(req.getSlaMediaHoras());
        if (req.getSlaBajaHoras()  != null) cat.setSlaBajaHoras (req.getSlaBajaHoras());

        return CategoriaResponse.from(repo.save(cat));
    }

    // ── Desactivar (soft delete) ──
    public void desactivar(String id) {
        Categoria cat = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id));
        cat.setActiva(false);
        repo.save(cat);
    }

    // ── Reactivar ──
    public CategoriaResponse reactivar(String id) {
        Categoria cat = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id));
        cat.setActiva(true);
        return CategoriaResponse.from(repo.save(cat));
    }

    // ── Método de utilidad para que TareaService calcule SLA ──
    public Categoria obtenerDocumentoPorId(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + id));
    }
}