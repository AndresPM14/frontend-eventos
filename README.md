# 🎓 EventosUC - Frontend

Aplicación web desarrollada en Angular para la gestión de eventos académicos de la Universidad del Cauca. Proyecto final de la asignatura Desarrollo de Aplicaciones Web.

## Descripción

EventosUC permite a estudiantes y docentes consultar eventos académicos, realizar inscripciones y administrar la asistencia. La plataforma cuenta con dos roles: administrador y participante.

## Funcionalidades

- Registro e inicio de sesión con JWT
- Roles: administrador y participante
- CRUD completo de eventos (solo administrador)
- Inscripción y cancelación de inscripción a eventos
- Visualización de cupos disponibles en tiempo real
- Protección de rutas con Auth Guard
- Diseño responsivo y moderno

## Tecnologías utilizadas

- Angular 19 (standalone components)
- TypeScript
- HTML5 / CSS3
- JWT para autenticación
- HttpClient para consumo de API REST

## Instalación y ejecución

1. Clonar el repositorio y entrar a la carpeta:
   git clone https://github.com/AndresPM14/frontend-eventos.git
   cd frontend-eventos

2. Instalar dependencias:
   npm install

3. Configurar la URL del backend en src/app/core/services/api.config.ts:
   export const API_URL = 'http://localhost:3000';

4. Ejecutar la aplicación:
   ng serve

5. Abrir en el navegador: http://localhost:4200

El backend debe estar corriendo antes de iniciar el frontend.

## Estructura del proyecto

src/app/
├── auth/
│   ├── login/          # Componente de inicio de sesión
│   └── register/       # Componente de registro
├── core/
│   ├── guards/         # Auth guard para protección de rutas
│   └── services/       # AuthService y configuración de API
├── events/
│   ├── event-list/     # Lista y gestión de eventos
│   └── services/       # EventsService (CRUD + inscripciones)

## Repositorio Backend

El backend fue desarrollado con NestJS y PostgreSQL:
https://github.com/helenchantre/backend-eventos

## Autor

Andrés Pabón
Estudiante de Ingeniería en Telemática
Universidad del Cauca
pabonandres@unicauca.edu.co
