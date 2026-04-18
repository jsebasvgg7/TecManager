package com.demo.tecmanager.dto.tarea;

import java.util.List;

public class TareaPageResponse {

    private List<TareaResponse> contenido;
    private int paginaActual;
    private int totalPaginas;
    private long totalElementos;
    private boolean hayMas;

    public TareaPageResponse(List<TareaResponse> contenido, int paginaActual,int totalPaginas, long totalElementos, boolean hayMas) {
        this.contenido = contenido;
        this.paginaActual = paginaActual;
        this.totalPaginas = totalPaginas;
        this.totalElementos = totalElementos;
        this.hayMas = hayMas;
    }

    public List<TareaResponse> getContenido() { return contenido; }
    public int getPaginaActual() { return paginaActual; }
    public int getTotalPaginas() { return totalPaginas; }
    public long getTotalElementos() { return totalElementos; }
    public boolean isHayMas(){ return hayMas; }
}