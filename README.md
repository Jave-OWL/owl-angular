# 🦉 OWL - Plataforma de Análisis de Fondos de Inversión Colectiva

<div align="center">

Una plataforma web moderna para explorar, comparar y analizar Fondos de Inversión Colectiva (FICs) en el mercado colombiano.

</div>

---

## 📋 Descripción

OWL es una aplicación Angular que permite a los usuarios descubrir y analizar fondos de inversión colectiva mediante:

- **Perfilamiento de riesgo** utilizando un cuestionario basado en el "Grable & Lytton"
- **Exploración de fondos** con búsqueda, filtrado y ordenamiento
- **Análisis detallado** con rendimiento histórico y composición de portafolio
- **Comparación lado a lado** de múltiples fondos
- **Panel administrativo** para gestión de la plataforma

## ✨ Características

### Para Usuarios
- 🎯 **Cuestionario de Perfil de Riesgo**: Evaluación personalizada basada en metodología Grable & Lytton
- 🔍 **Explorador de Fondos**: Búsqueda y filtrado avanzado por gestor, tipo y rendimiento
- 📊 **Visualizaciones Interactivas**: Gráficos detallados con ECharts
- 📈 **Comparador de Fondos**: Análisis comparativo con resaltado automático
- 🎓 **Tours Guiados**: Tutoriales interactivos con Driver.js 

### Para Administradores
- 👥 **Gestión de Usuarios**: Panel completo de administración
- 💼 **Gestión de FICs**: Mantenimiento de base de datos de fondos
- 📊 **Dashboard Administrativo**: Métricas y estadísticas 

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI 19.2.6 

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Jave-OWL/owl-angular.git
cd owl-angular
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
npm run config
```

4. **Iniciar servidor de desarrollo**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

## 🛠️ Uso

### Desarrollo

```bash
# Servidor de desarrollo
npm start

# Compilar para producción
npm run build:prod

# Ejecutar pruebas
npm test
```
## 🏗️ Arquitectura

### Estructura del Proyecto

### 📁 Estructura del Proyecto
```
owl-angular/
├── src/
│   ├── app/
│   │   ├── core/         # Servicios, guards, modelos e interceptores
│   │   ├── features/     # Módulos de características
│   │   │   ├── auth/     # Autenticación (login, registro)
│   │   │   ├── FICs/     # Exploración y análisis de fondos
│   │   │   ├── usuario/  # Dashboard y perfil de usuario
│   │   │   └── admin/    # Panel administrativo
│   │   ├── layout/       # Componentes de diseño (header, footer, etc.)
│   │   ├── shared/       # Componentes reutilizables (botones, inputs, etc.)
│   │   └── routes/       # Componentes de página y enrutamiento
│   ├── assets/           # Recursos estáticos (imágenes, íconos, estilos)
│   └── environments/     # Configuraciones de entorno (dev, prod)
```
### Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Angular | 19.2.x | Framework frontend |
| TypeScript | ~5.7.2 | Lenguaje de programación |
| RxJS | ~7.8.0 | Programación reactiva |
| Bootstrap | 3.4.1 | Biblioteca de componentes UI |
| ECharts | 6.0.0 | Visualización de datos |
| Driver.js | 1.3.6 | Tours de incorporación |

<cite></cite>

### Módulos Principales

#### Autenticación (`/auth`)
- Inicio de sesión y registro de usuarios
- Recuperación de contraseña
- Gestión de sesiones con JWT

#### Fondos de Inversión (`/fics`)
- **Explorar**: Búsqueda y filtrado de fondos
- **Detalle**: Visualización completa con gráficos interactivos
- **Comparar**: Análisis comparativo de múltiples fondos
- **Pronosticar**: Proyección de retornos de inversión

<cite></cite>

#### Usuario (`/user`)
- Dashboard personalizado con recomendaciones
- Cuestionario de perfil de riesgo
- Gestión de perfil

<cite></cite>

#### Administración (`/admin`)
- Dashboard administrativo
- Gestión de usuarios y fondos
- Protegido con guard de administrador

<cite></cite>

## 🔒 Seguridad

- Autenticación basada en JWT
- Guards de ruta para protección de acceso
- Interceptores HTTP para manejo de tokens
- Validación de roles (usuario/administrador)

