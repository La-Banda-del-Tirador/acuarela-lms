# Acuarela LMS 🎨

**Estado del Documento**: Aprobado para Prototipado Rápido (Frontend-First)  
**Arquitectura de Referencia**: Clean Architecture (Proyección V2 Backend en .NET Core 9 y PostgreSQL)  
**Almacenamiento**: Zustand con Persistencia en `localStorage`

---

## 🚀 Introducción

**Acuarela LMS** es un frontend modular, moderno y de alta estética visual diseñado como prototipo funcional de un Sistema de Gestión de Aprendizaje (LMS). La aplicación se ejecuta al 100% en el cliente, utilizando **Zustand** para persistir el estado global en el navegador simulando transacciones de base de datos relacionales locales.

Este prototipo se ha estructurado de manera desacoplada: **la interfaz de usuario (UI) no contiene lógica de negocio directa**, sino que consume selectores y acciones del Store global. Esto asegura una transición transparente en una fase posterior hacia un backend real en **.NET Core 9** y **PostgreSQL**, donde solo será necesario sustituir las acciones de Zustand por llamadas HTTP.

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: React 19 + TypeScript (tipado estricto sin uso de `any`)
- **Estilos**: Tailwind CSS v4 (con soporte nativo para Modo Oscuro/Claro)
- **Gestión de Estado**: Zustand + Middleware Persist (`localStorage`)
- **Iconografía**: Lucide React
- **Compilador/Empaquetador**: Vite v8

---

## 📐 Principios de Codificación y Arquitectura

1. **Componentes Atómicos e Independientes**: Cada componente está diseñado para ser pequeño, autocontenido y enfocado (con una extensión recomendada de menos de 100 líneas).
2. **Tipado Estricto**: Todo el modelo relacional está fuertemente tipado en `src/types/index.ts`.
3. **Clean Architecture (Desacoplamiento)**: Ningún componente de React puede alterar directamente las variables de los objetos. Todas las mutaciones del estado del negocio se solicitan obligatoriamente a través de las acciones de Zustand, imitando la invocación de endpoints en un API REST.

---

## 📦 Módulos del Sistema

### 🏢 Módulo 1: Gestión de Materias (Comunidades)
- **Creación de Cursos (Docente)**: Formulario interactivo exclusivo para el rol de `PROFESOR_ADMIN`. El sistema autogenera un código alfanumérico único de 6 caracteres (ej: `AC-4892`) para inscripción.
- **Tablero Dinámico (Dashboard)**: Carga dinámica según el rol del usuario conectado:
  - **Docente**: Visualiza los cursos que ha creado y en los que figura como titular.
  - **Estudiante**: Visualiza únicamente las materias en las que está explícitamente matriculado.
- **Repositorio de Materiales**: El docente puede indexar y publicar enlaces web externos (carpetas de Google Drive, documentos compartidos o videos de YouTube), categorizados por tipo y materia.

### 👥 Módulo 2: Miembros del Grupo
- **Lista de Miembros**: Permite visualizar en el detalle de la materia a los integrantes en una jerarquía limpia (Profesor asignado en la parte superior y lista ordenada alfabéticamente de estudiantes matriculados), protegiendo datos sensibles como teléfonos o contraseñas.

### 📢 Módulo 3: Cartelera Virtual (Avisos)
- **Publicación Inmediata (Docente)**: Muro interactivo dentro de la materia para publicar avisos de última hora.
- **Orden Cronológico Inverso**: Los anuncios se despliegan en orden cronológico descendente, mostrando primero la información más reciente.
- **Sistema de Alertas Locales (Toasts)**: El guardado de anuncios dispara alertas visuales flotantes tipo Toast simulando notificaciones push.

### 📝 Módulo 4: Tareas y Entregas
- **Constructor de Tareas (Docente)**: Configuración de título, instrucciones, puntos máximos y selector de calendario (`datetime-local`) para la fecha y hora límite exacta.
- **Panel central "Mis Pendientes" (Estudiante)**: Vista centralizada para el estudiante que recorre todas sus materias inscritas para contrastar las tareas publicadas contra sus entregas. Las tareas no entregadas se priorizan ordenándose por la fecha de vencimiento más urgente.
- **Carga de Evidencias Simulada (Drag & Drop)**: Interfaz de arrastre de archivos en el navegador. Extrae metadatos (nombre de archivo, tamaño en bytes y extensión) para inyectarlos en el Store. El archivo real se descarta para optimizar la memoria.
- **Validación de Límites de Servidor (RNF-02)**: Bloqueo de cargas en el cliente que superen los 20MB, mostrando el mensaje: *"El archivo excede el límite máximo de 20MB configurado para la infraestructura de servidores"*.
- **Controlador de Estados**: Al entregar, compara la hora del sistema contra el `dueDate` de la tarea para registrar automáticamente si fue entregada a tiempo o con el estado `ENTREGADO_CON_RETRASO` (marcado en tonos naranja/rojo en la interfaz).
- **Calificación y Retroalimentación**: Panel de revisión donde el docente puede examinar la metadata del archivo simulado, ingresar una calificación válida (menor o igual al puntaje máximo de la tarea) y redactar retroalimentación privada. Al confirmarse, el estado cambia a `CALIFICADO`.

---

## 🎨 Estética "Watercolor Fluids" (UI/UX)

La aplicación cuenta con una identidad visual inspirada en pinturas de acuarela fluidas:
- **Tema Claro / Oscuro Nativo**: Transición uniforme a través de clases nativas de Tailwind CSS v4.
- **Gradientes Suaves y Animados**: El fondo utiliza blobs difuminados (`filter: blur()`) que cambian y flotan mediante keyframes (`@keyframes float`).
- **Micro-interacciones Fluidas**: Botones, campos de formulario y tarjetas cuentan con transiciones de color de 500ms (`transition-all duration-500 ease-in-out`) para evitar cambios de color bruscos.
- **Paneles Glassmorphic**: Contenedores de tarjetas y modales con transparencias y desenfoque del fondo (`backdrop-filter: blur(20px)`).

---

## 💻 Ejecución Local

Para ejecutar el prototipo de Acuarela LMS de forma local, sigue estos pasos:

1. **Clonar e ingresar al repositorio**:
   ```bash
   cd acuarela
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo en caliente (Vite)**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   Accede a [http://localhost:5173/](http://localhost:5173/)

*Nota: Para cambiar de rol entre **Docente** (Lic. Carmen Flores) y **Estudiante** (Alejandro Arce), utiliza el selector flotante en la esquina inferior izquierda de la pantalla.*

---

## 📊 Matriz de Alcance (Prototipo Actual vs V2 en Producción)

| Característica | Implementación en Prototipo Actual (Frontend-First) | Implementación en Producción Futura (V2) |
| :--- | :--- | :--- |
| **Identidad y Acceso** | Selector flotante (`RoleSwitcher`) para intercambio de roles en caliente. | Control de acceso basado en roles (RBAC) mediante JWT y Cookies HTTPS-Only. |
| **Almacenamiento de Archivos** | Extracción de metadatos del archivo simulado en `localStorage`. | Carga real asíncrona a buckets S3/MinIO utilizando streams de datos. |
| **Notificaciones** | Toasts y alertas visuales disparados en memoria local. | Envío asíncrono con colas de mensajería (RabbitMQ/SQS) y WebSockets. |
| **Persistencia** | Datos serializados en JSON dentro de `localStorage` (~5MB máx). | Base de datos relacional robusta (PostgreSQL) con llaves y restricciones estrictas. |

---

## 📂 Estructura de Archivos

- `src/types/index.ts` - [Tipos e Interfaces de Datos](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/types/index.ts)
- `src/store/useAcuarelaStore.ts` - [Store Centralizado de Zustand](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/store/useAcuarelaStore.ts)
- `src/store/useToastStore.ts` - [Store de Notificaciones Toast](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/store/useToastStore.ts)
- `src/hooks/useToast.ts` - [Hook de Alertas Rápidas](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/hooks/useToast.ts)
- `src/components/ui/` - [Componentes Atómicos Reutilizables (Modal, Toasts)](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/components/ui)
- `src/components/layout/` - [Estructuras del Layout (Navbar, RoleSwitcher)](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/components/layout)
- `src/components/dashboard/` - [Componentes del Tablero de Materias](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/components/dashboard)
- `src/components/course/` - [Detalles del Curso (Anuncios, Materiales, Compañeros, Tareas)](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/components/course)
- `src/components/assignment/` - [Componentes de Tareas, Entregas y Calificaciones](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/components/assignment)
- `src/pages/` - [Vistas Principales de la Aplicación (Tablero, Aula, Pendientes)](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/pages)
- `src/App.tsx` - [Orquestador de Layouts y Enrutamiento](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/App.tsx)
- `src/index.css` - [Estilos Globales de Acuarela Fluids y Configuración Tailwind v4](file:///c:/Users/Desktop/Documents/Dev/capibaradigital/acuarela/src/index.css)
