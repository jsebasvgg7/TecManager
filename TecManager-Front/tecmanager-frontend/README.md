# TecManager Frontend

TecManager es un sistema operativo centrado en facilitar a los equipos técnicos la asignación, monitoreo y gestión de procesos mediante una interfaz unificada y moderna. El frontend está construido en **React** apoyado con **Vite**.

## Estado Actual & Últimas Actualizaciones

Recientemente, la plataforma ha atravesado una importante reformulación de interfaces (UI/UX) y de lenguaje visual:

1. **Reemplazo de "Tareas" a "Tickets":** 
   - Se migró por completo toda la estructura de presentación, desde variables internas pasando por modales de React hasta visualización en pantalla, hacia la terminología **Tickets** (ej. "Total de tickets", "Tickets vencidos", /tickets).
   - **Nota de API Segura:** El servidor y el backend se han dejado 100% intactos en su lógica interna original. Las rutas del API en este código (por ejemplo `api.get('/tareas')`) o claves retornadas de la base de datos (por ejemplo `datos.tareasVencidas`) **no fueron renombradas** deliberadamente para garantizar completa estabilidad retrocompatible con el backend existente y evitar roturas API.
   - El CSS asociado al sistema de grillas pasó de `.tareas-grid` a `.tickets-grid` logrando un mayor salto en espaciado y comodidad (24px de espaciado dinámico).

2. **Estandarización de Iconografía (Lucide React):** 
   - Se removió al 100% el uso de Emojis dentro de componentes de control visual como estado del ticket o configuración de especialidades, los cuales se prestan para renderizados inconsistentes entre distintos Sistemas Operativos. 
   - Se incorporó la dependencia universal `lucide-react`, renderizando los iconos dinámicamente o de forma estática en las Cards y Navbars para lograr una estética verdaderamente pulida, estandarizada y profesional a nivel de la interfaz.

3. **Arquitectura y Estilos en Línea a Archivos:** 
   - Se modularon los estilos y comportamientos de `.ticket-card`, modales y el dashboard, apartando los CSS inline en archivos en el directorio `/styles`.

## Scripts Existentes

En el directorio principal que contiene el `package.json`, puedes utilizar los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo en modo local (utilizando Vite).
- `npm run build`: Empaqueta la compilación optimizada de la plataforma de React.
- `npm run preview`: Previsualiza de forma local el paquete optimizado generado por `build`.

## Contexto de Archivos Clave

- **`App.jsx`**: Punto de entrada de todas las rutas manejadas por `react-router-dom` usando las nuevas URL enfocadas en tickets (`/tickets`, `/mis-tickets`).
- **`/components/tickets`**: Librería de componentes como tarjetas, lista y formularios de tickets.
- **`/components/dashboard`**: Componentes estadísticos que leen el consolidado backend para renderizado mediante animaciones nativas.
- **`/styles`**: Archivos `.css` segregados para la personalización y uso de Variables de colores estandarizadas.

## Herramientas de Desarrollo
- React 18
- Vite
- React Router DOM
- Axios (Para solicitudes en `api/axiosConfig.js`)
- Lucide React (Sistema universal de Iconos SVG)

---
*TecManager — Simplificando el ecosistema de técnicos y reportes centralizados.*
