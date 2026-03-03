# TecManager
proyecto de aula semestre 5


login metodo post http://localhost:8080/api/auth/login
credenciales de admin 
{
  "email": "admin@sistema.com",
  "password": "Admin1234"
}

id de carlos 69a4dadc20e9e6611c5343fe
credenciales de carlos
{
  "email": "carlos@sistema.com",
  "password": "Tecnico123"
}

crear tarea
POST http://localhost:8080/api/tareas
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "titulo": "Instalar servidor web",
  "descripcion": "Instalar y configurar Apache en el servidor principal",
  "prioridad": "ALTA",
  "tecnicoId": "<id_de_carlos>",
  "fechaLimite": "2026-12-31T23:59:59",
  "tiempoEstimadoHoras": 4
}

cambiar estado 
PATCH http://localhost:8080/api/tareas/<id_tarea>/estado
Authorization: Bearer <token_tecnico>

{
  "nuevoEstado": "EN_PROCESO",
  "comentario": "Iniciando la instalación del servidor"
}

finalizar 
PATCH http://localhost:8080/api/tareas/<id_tarea>/estado
Authorization: Bearer <token_tecnico>

{
  "nuevoEstado": "FINALIZADA",
  "comentario": "Servidor instalado y configurado correctamente"
}

ver historial
GET http://localhost:8080/api/historial/tarea/<id_tarea>
Authorization: Bearer <token_admin>
