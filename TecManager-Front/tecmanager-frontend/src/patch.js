const fs = require('fs');

function patchFile() {
  let file = 'c:/Users/DIANA/OneDrive/Escritorio/PRO_AULA/TecManager/TecManager-Front/tecmanager-frontend/src/pages/DashboardPage.jsx';
  let c = fs.readFileSync(file, 'utf8');

  // Regex rules to replace words "tarea", "tareas", "Tarea", "Tareas"
  // but keep API identifiers untouched.

  // Labels
  c = c.replace(/Total de tareas/g, 'Total de tickets');
  c = c.replace(/'Gestión de Tareas'/g, "'Gestión de Tickets'");
  c = c.replace(/Sin tareas vencidas/g, 'Sin tickets vencidos');
  c = c.replace(/'Ver tareas'/g, "'Ver tickets'");
  c = c.replace(/navigate\('\/tareas'\)/g, "navigate('/tickets')");
  
  // Dashboard text chunks
  c = c.replace(/tareas completadas/g, 'tickets completados');
  c = c.replace(/tareas sin asignar/g, 'tickets sin asignar');
  c = c.replace(/tareas fuera de plazo/g, 'tickets fuera de plazo');
  c = c.replace(/'Tareas por estado'/g, "'Tickets por estado'");
  c = c.replace(/Distribución de tareas/g, 'Distribución de tickets');
  c = c.replace(/Proporción de tareas/g, 'Proporción de tickets');
  
  // Table headers and generic text
  c = c.replace(/'Tarea'/g, "'Ticket'");
  c = c.replace(/Cargando tareas/g, 'Cargando tickets');
  c = c.replace(/No hay tareas/g, 'No hay tickets');
  c = c.replace(/'Nueva tarea'/g, "'Nuevo ticket'");
  c = c.replace(/Buscar tarea/g, 'Buscar ticket');
  c = c.replace(/Ver todas las tareas/g, 'Ver todos los tickets');
  c = c.replace(/'Tareas completadas'/g, "'Tickets completados'");
  c = c.replace(/tareas ·/g, 'tickets ·');
  c = c.replace(/'Tareas vencidas'/g, "'Tickets vencidos'");
  
  // Dynamic template literals
  c = c.replace(/tarea\$\{datos/g, 'ticket${datos');
  c = c.replace(/\$\{datos\.tareasVencidas \!== 1 \? 's' : ''\} vencida/g, '${datos.tareasVencidas !== 1 ? \\'s\\' : \\'\\'} vencido');
  // Handle specific template line:
  // ${datos.tareasVencidas} tarea${...} vencida${...} pendiente${...}
  c = c.replace(/tarea\$\{datos/g, 'ticket${datos');
  c = c.replace(/vencida\$\{datos/g, 'vencido${datos');
  
  // High priority alerts
  c = c.replace(/tarea\$\{datos\.tareasAltaPrioridad \!== 1 \? 's' : ''\} con prioridad alta activas/g, 'ticket${datos.tareasAltaPrioridad !== 1 ? \\'s\\' : \\'\\'} con prioridad alta activos');
  
  c = c.replace(/todas las tareas/g, 'todos los tickets');
  c = c.replace(/las tareas/g, 'los tickets');
  
  fs.writeFileSync(file, c);
  console.log('Dashboard patched.');
}

patchFile();
