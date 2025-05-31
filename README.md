# API de Restaurantes

API REST para recomendaciones de restaurantes con autenticación y registro de auditoría.

## Características

-   🔐 Autenticación de usuarios con JWT
-   📍 Búsqueda de restaurantes por ubicación usando Google Places API
-   📝 Registro de auditoría de acciones de usuarios
-   🛡️ Validación de datos con express-validator
-   🐳 Configuración con Docker para fácil despliegue
-   📊 Paginación en endpoints de auditoría

## Requisitos Previos

-   Node.js (v14 o superior)
-   Docker y Docker Compose
-   Cuenta de Google Cloud Platform con Places API habilitada
-   MongoDB (incluido en Docker)

## Configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/WilliamMendez/Restaurant-API.git
cd Restaurant-API
```

2. Crear archivo `.env` en la raíz del proyecto:

```env
MONGODB_URI=mongodb://mongodb:27017/restaurant-api
JWT_SECRET=tu_secreto_jwt
GOOGLE_MAPS_API_KEY=tu_api_key_de_google
```

3. Instalar dependencias:

```bash
npm install
```

## Ejecución

### Usando Docker (Recomendado)

1. Construir y levantar los contenedores:

```bash
docker compose up --build
```

2. Para detener los contenedores:

```bash
docker compose down
```

### Sin Docker

1. Iniciar MongoDB localmente
2. Ejecutar la aplicación:

```bash
npm start
```

## Endpoints de la API

### Autenticación

#### Registro de Usuario

-   **POST** `/api/auth/register`
-   Body:

```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123",
    "name": "Nombre Usuario"
}
```

#### Inicio de Sesión

-   **POST** `/api/auth/login`
-   Body:

```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}
```

#### Obtener Usuario Actual

-   **GET** `/api/auth/me`
-   Requiere token de autenticación

### Restaurantes

#### Obtener Recomendaciones

-   **GET** `/api/restaurants/recommendations`
-   Query params:
    -   `latitude`: Latitud (-90 a 90)
    -   `longitude`: Longitud (-180 a 180)
    -   `radius`: Radio de búsqueda en metros (1 a 50000)
-   Requiere token de autenticación

### Auditoría

#### Obtener Todos los Logs

-   **GET** `/api/audit`
-   Query params:
    -   `page`: Número de página
    -   `limit`: Límite por página (1-100)
-   Requiere token de autenticación

#### Obtener Logs de Usuario

-   **GET** `/api/audit/user/:userId`
-   Query params:
    -   `page`: Número de página
    -   `limit`: Límite por página (1-100)
-   Requiere token de autenticación

## Scripts Disponibles

-   `npm start`: Inicia la aplicación
-   `npm run dev`: Inicia la aplicación en modo desarrollo con nodemon
-   `npm test`: Ejecuta las pruebas de la API
-   `npm run docker:build`: Construye las imágenes de Docker
-   `npm run docker:up`: Levanta los contenedores
-   `npm run docker:down`: Detiene los contenedores
-   `npm run docker:restart`: Reinicia los contenedores
-   `npm run docker:logs`: Muestra los logs de los contenedores
-   `npm run docker:clean`: Limpia los contenedores y volúmenes
-   `npm run clean`: Limpia node_modules y reinstala dependencias

## Validaciones

La API incluye validaciones para:

-   Email: Formato válido y normalización
-   Contraseña: Mínimo 6 caracteres
-   Nombre: Mínimo 2 caracteres
-   Coordenadas: Rangos válidos
-   Radio de búsqueda: Entre 100 y 50000 metros
-   Paginación: Números positivos y límites razonables

## Registro de Auditoría

Se registran automáticamente las siguientes acciones:

-   Registro de usuarios
-   Inicio de sesión
-   Búsquedas de restaurantes
-   Consultas de logs

Cada registro incluye:

-   ID del usuario
-   Tipo de acción
-   Fecha y hora
-   IP del cliente
-   User Agent
-   Estado de la respuesta
