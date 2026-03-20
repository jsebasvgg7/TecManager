package com.demo.tecmanager.dto.tarea;

import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import java.time.LocalDateTime;
import java.util.List;

public class TareaResponse {

    // ── Campos originales ──
    private String id;
    private String titulo;
    private String descripcion;
    private Prioridad prioridad;
    private EstadoTarea estado;
    private String tecnicoId;
    private String tecnicoNombre;
    private String creadaPor;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaLimite;
    private Integer tiempoEstimadoHoras;
    private Integer tiempoRealHoras;
    private boolean vencida;

    // ── Nuevos: categoría ──
    private String categoriaId;
    private String categoriaNombre;
    private String categoriaColor;
    private String categoriaIcono;

    // ── Nuevos: asignación múltiple ──
    private List<String> tecnicosIds;
    private List<String> tecnicosNombres;

    // ── Nuevos: SLA ──
    private LocalDateTime fechaLimiteSla;
    private boolean slaVencido;

    // ── Nuevos: avance / evidencia ──
    private Integer porcentajeAvance;
    private List<String> etiquetas;
    private String evidenciaUrl;

    public TareaResponse() {}

    public String getId()                       { return id; }
    public String getTitulo()                   { return titulo; }
    public String getDescripcion()              { return descripcion; }
    public Prioridad getPrioridad()             { return prioridad; }
    public EstadoTarea getEstado()              { return estado; }
    public String getTecnicoId()                { return tecnicoId; }
    public String getTecnicoNombre()            { return tecnicoNombre; }
    public String getCreadaPor()                { return creadaPor; }
    public LocalDateTime getFechaCreacion()     { return fechaCreacion; }
    public LocalDateTime getFechaLimite()       { return fechaLimite; }
    public Integer getTiempoEstimadoHoras()     { return tiempoEstimadoHoras; }
    public Integer getTiempoRealHoras()         { return tiempoRealHoras; }
    public boolean isVencida()                  { return vencida; }
    public String getCategoriaId()              { return categoriaId; }
    public String getCategoriaNombre()          { return categoriaNombre; }
    public String getCategoriaColor()           { return categoriaColor; }
    public String getCategoriaIcono()           { return categoriaIcono; }
    public List<String> getTecnicosIds()        { return tecnicosIds; }
    public List<String> getTecnicosNombres()    { return tecnicosNombres; }
    public LocalDateTime getFechaLimiteSla()    { return fechaLimiteSla; }
    public boolean isSlaVencido()               { return slaVencido; }
    public Integer getPorcentajeAvance()        { return porcentajeAvance; }
    public List<String> getEtiquetas()          { return etiquetas; }
    public String getEvidenciaUrl()             { return evidenciaUrl; }

    public void setId(String id)                              { this.id = id; }
    public void setTitulo(String titulo)                      { this.titulo = titulo; }
    public void setDescripcion(String descripcion)            { this.descripcion = descripcion; }
    public void setPrioridad(Prioridad prioridad)             { this.prioridad = prioridad; }
    public void setEstado(EstadoTarea estado)                 { this.estado = estado; }
    public void setTecnicoId(String tecnicoId)                { this.tecnicoId = tecnicoId; }
    public void setTecnicoNombre(String tecnicoNombre)        { this.tecnicoNombre = tecnicoNombre; }
    public void setCreadaPor(String creadaPor)                { this.creadaPor = creadaPor; }
    public void setFechaCreacion(LocalDateTime v)             { this.fechaCreacion = v; }
    public void setFechaLimite(LocalDateTime v)               { this.fechaLimite = v; }
    public void setTiempoEstimadoHoras(Integer v)             { this.tiempoEstimadoHoras = v; }
    public void setTiempoRealHoras(Integer v)                 { this.tiempoRealHoras = v; }
    public void setVencida(boolean vencida)                   { this.vencida = vencida; }
    public void setCategoriaId(String v)                      { this.categoriaId = v; }
    public void setCategoriaNombre(String v)                  { this.categoriaNombre = v; }
    public void setCategoriaColor(String v)                   { this.categoriaColor = v; }
    public void setCategoriaIcono(String v)                   { this.categoriaIcono = v; }
    public void setTecnicosIds(List<String> v)                { this.tecnicosIds = v; }
    public void setTecnicosNombres(List<String> v)            { this.tecnicosNombres = v; }
    public void setFechaLimiteSla(LocalDateTime v)            { this.fechaLimiteSla = v; }
    public void setSlaVencido(boolean v)                      { this.slaVencido = v; }
    public void setPorcentajeAvance(Integer v)                { this.porcentajeAvance = v; }
    public void setEtiquetas(List<String> v)                  { this.etiquetas = v; }
    public void setEvidenciaUrl(String v)                     { this.evidenciaUrl = v; }
}