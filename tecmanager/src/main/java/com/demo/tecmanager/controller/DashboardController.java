package com.demo.tecmanager.controller;

import com.demo.tecmanager.dto.dashboard.DashboardResponse;
import com.demo.tecmanager.dto.dashboard.TecnicoMetricaResponse;
import com.demo.tecmanager.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<DashboardResponse> obtenerMetricas() {
        return ResponseEntity.ok(dashboardService.obtenerMetricas());
    }

    @GetMapping("/tecnico/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<TecnicoMetricaResponse> metricasTecnico(@PathVariable String id) {
        return ResponseEntity.ok(dashboardService.obtenerMetricasTecnico(id));
    }

}
