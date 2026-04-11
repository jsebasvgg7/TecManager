package com.demo.tecmanager.config;

import com.demo.tecmanager.security.JwtAuthenticationFilter;
import com.demo.tecmanager.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl  userDetailsService;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService      = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            // Usa el CorsConfig.java que ya existe — no se define corsConfigurationSource aquí
            .cors(cors -> cors.configure(http))
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── Públicos ──
                .requestMatchers("/api/auth/**").permitAll()

                // ── Usuarios ──
                .requestMatchers(HttpMethod.GET, "/api/usuarios/rol/**").hasAnyRole("ADMIN", "ASIGNADOR")
                .requestMatchers(HttpMethod.GET, "/api/usuarios/activos").hasAnyRole("ADMIN", "ASIGNADOR")
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                // ── Categorías: lectura para todos, escritura solo ADMIN ──
                .requestMatchers(HttpMethod.GET,    "/api/categorias/**").authenticated()
                .requestMatchers(HttpMethod.POST,   "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH,  "/api/categorias/**").hasRole("ADMIN")

                // ── Tareas ──
                .requestMatchers(HttpMethod.GET,    "/api/tareas/mis-tareas").hasRole("TECNICO")
                .requestMatchers(HttpMethod.POST,   "/api/tareas").hasAnyRole("ADMIN", "ASIGNADOR")
                .requestMatchers(HttpMethod.PUT,    "/api/tareas/**").hasAnyRole("ADMIN", "ASIGNADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/tareas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH,  "/api/tareas/**").authenticated()
                .requestMatchers(HttpMethod.GET,    "/api/tareas/**").authenticated()

                // ── Reportes ──
                .requestMatchers(HttpMethod.GET, "/api/reportes").hasRole("ADMIN")
                .requestMatchers("/api/reportes/**").hasAnyRole("ADMIN", "ASIGNADOR")

                // ── Historial ──
                .requestMatchers("/api/historial/**").hasAnyRole("ADMIN", "ASIGNADOR")

                // ── Dashboard ──
                .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN", "ASIGNADOR")

                // ── Notificaciones ──
                .requestMatchers("/api/notificaciones/**").authenticated()

                // ── Especialidades ──
                .requestMatchers("/api/especialidades/**").hasAnyRole("ADMIN", "ASIGNADOR", "TECNICO")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class);

        http.headers(headers ->
                headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}