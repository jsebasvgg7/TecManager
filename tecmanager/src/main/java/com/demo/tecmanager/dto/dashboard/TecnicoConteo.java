package com.demo.tecmanager.dto.dashboard;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TecnicoConteo {

    @JsonProperty("_id")
    private String id;
    private long count;
    private Double promedio;

    public String getId() {
        return id;
    }

    public long getCount() {
        return count;
    }

    public Double getPromedio() {
        return promedio;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public void setPromedio(Double p) {
        this.promedio = p;
    }
}