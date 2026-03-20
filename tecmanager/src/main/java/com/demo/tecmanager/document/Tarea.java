package com.demo.tecmanager.document;

import com.demo.tecmanager.enums.EstadoTarea;
import com.demo.tecmanager.enums.Prioridad;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tareas")
public class Tarea {

    @Id
    private String id;

    @Field("titulo")
    private String titulo;

    @Field("descripcion")
    private String descripcion;

    @Field("prioridad")
    private Prioridad prioridad = Prioridad.MEDIA;

    @Field("estado")
    private EstadoTarea estado = EstadoTarea.PENDIENTE;

    // ── NUEVO: categoría ──
    @Field("categoria_id")
    private String categoriaId;

    // ── NUEVO: asignación múltiple ──
    // tecnicoId se mantiene como "responsable principal"
    @Field("tecnico_id")
    private String tecnicoId;

    // técnicos colaboradores adicionales
    @Field("tecnicos_ids")
    private List<String> tecnicosIds = new ArrayList<>();

    @Field("creada_por")
    private String creadaPor;

    @Field("fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Field("fecha_limite")
    private LocalDateTime fechaLimite;

    @Field("tiempo_estimado_horas")
    private Integer tiempoEstimadoHoras;

    @Field("tiempo_real_horas")
    private Integer tiempoRealHoras;

    @Field("fecha_inicio_proceso")
    private LocalDateTime fechaInicioProceso;

    @Field("fecha_finalizacion")
    private LocalDateTime fechaFinalizacion;

    // ── NUEVO: SLA ──
    // Fecha límite calculada según SLA de la categoría al momento de crear
    @Field("fecha_limite_sla")
    private LocalDateTime fechaLimiteSla;

    // Si el SLA ya fue superado al momento de consultar
    @Field("sla_vencido")
    private boolean slaVencido = false;

    // ── NUEVO: avance parcial ──
    @Field("porcentaje_avance")
    private Integer porcentajeAvance = 0; // 0–100

    // ── NUEVO: etiquetas libres ──
    @Field("etiquetas")
    private List<String> etiquetas = new ArrayList<>();

    // ── NUEVO: URL de evidencia al finalizar ──
    @Field("evidencia_url")
    private String evidenciaUrl;

    public Tarea() {}

    public Tarea(String titulo, String descripcion, Prioridad prioridad,
                 String tecnicoId, String creadaPor, LocalDateTime fechaLimite,
                 Integer tiempoEstimadoHoras, String categoriaId) {
        this.titulo               = titulo;
        this.descripcion          = descripcion;
        this.prioridad            = prioridad;
        this.estado               = EstadoTarea.PENDIENTE;
        this.tecnicoId            = tecnicoId;
        this.creadaPor            = creadaPor;
        this.fechaCreacion        = LocalDateTime.now();
        this.fechaLimite          = fechaLimite;
        this.tiempoEstimadoHoras  = tiempoEstimadoHoras;
        this.categoriaId          = categoriaId;
        this.porcentajeAvance     = 0;
        this.tecnicosIds          = new ArrayList<>();
        this.etiquetas            = new ArrayList<>();
    }

    // ── Getters ──
    public String getId()                        { return id; }
    public String getTitulo()                    { return titulo; }
    public String getDescripcion()               { return descripcion; }
    public Prioridad getPrioridad()              { return prioridad; }
    public EstadoTarea getEstado()               { return estado; }
    public String getCategoriaId()               { return categoriaId; }
    public String getTecnicoId()                 { return tecnicoId; }
    public List<String> getTecnicosIds()         { return tecnicosIds; }
    public String getCreadaPor()                 { return creadaPor; }
    public LocalDateTime getFechaCreacion()      { return fechaCreacion; }
    public LocalDateTime getFechaLimite()        { return fechaLimite; }
    public Integer getTiempoEstimadoHoras()      { return tiempoEstimadoHoras; }
    public Integer getTiempoRealHoras()          { return tiempoRealHoras; }
    public LocalDateTime getFechaInicioProceso() { return fechaInicioProceso; }
    public LocalDateTime getFechaFinalizacion()  { return fechaFinalizacion; }
    public LocalDateTime getFechaLimiteSla()     { return fechaLimiteSla; }
    public boolean isSlaVencido()                { return slaVencido; }
    public Integer getPorcentajeAvance()         { return porcentajeAvance; }
    public List<String> getEtiquetas()           { return etiquetas; }
    public String getEvidenciaUrl()              { return evidenciaUrl; }

    // ── Setters ──
    public void setId(String id)                               { this.id = id; }
    public void setTitulo(String titulo)                       { this.titulo = titulo; }
    public void setDescripcion(String descripcion)             { this.descripcion = descripcion; }
    public void setPrioridad(Prioridad prioridad)              { this.prioridad = prioridad; }
    public void setEstado(EstadoTarea estado)                  { this.estado = estado; }
    public void setCategoriaId(String categoriaId)             { this.categoriaId = categoriaId; }
    public void setTecnicoId(String tecnicoId)                 { this.tecnicoId = tecnicoId; }
    public void setTecnicosIds(List<String> tecnicosIds)       { this.tecnicosIds = tecnicosIds; }
    public void setCreadaPor(String creadaPor)                 { this.creadaPor = creadaPor; }
    public void setFechaCreacion(LocalDateTime fechaCreacion)  { this.fechaCreacion = fechaCreacion; }
    public void setFechaLimite(LocalDateTime fechaLimite)      { this.fechaLimite = fechaLimite; }
    public void setTiempoEstimadoHoras(Integer v)              { this.tiempoEstimadoHoras = v; }
    public void setTiempoRealHoras(Integer v)                  { this.tiempoRealHoras = v; }
    public void setFechaInicioProceso(LocalDateTime f)         { this.fechaInicioProceso = f; }
    public void setFechaFinalizacion(LocalDateTime f)          { this.fechaFinalizacion = f; }
    public void setFechaLimiteSla(LocalDateTime f)             { this.fechaLimiteSla = f; }
    public void setSlaVencido(boolean slaVencido)              { this.slaVencido = slaVencido; }
    public void setPorcentajeAvance(Integer porcentajeAvance)  { this.porcentajeAvance = porcentajeAvance; }
    public void setEtiquetas(List<String> etiquetas)           { this.etiquetas = etiquetas; }
    public void setEvidenciaUrl(String evidenciaUrl)           { this.evidenciaUrl = evidenciaUrl; }
}