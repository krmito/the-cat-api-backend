# API de Gatos - Documentación de Endpoints

## Descripción

API REST para gestión de información de razas de gatos y autenticación de usuarios. Esta API consume datos de [The Cat API](https://thecatapi.com/) y proporciona endpoints para registro/login de usuarios.

## Tabla de Contenidos

- [Inicio Rápido](#inicio-rápido)
- [Configuración](#configuración)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Autenticación](#autenticación)
  - [Razas de Gatos](#razas-de-gatos)
  - [Imágenes](#imágenes)
- [Códigos de Estado](#códigos-de-estado)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor en modo desarrollo
npm run dev

# Iniciar servidor en modo producción
npm start
```

### Servidor

El servidor se ejecuta por defecto en `http://localhost:3000`

---

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mean-database
NODE_ENV=development
API_BASE_URL=https://api.thecatapi.com/v1
API_KEY=tu_api_key_de_thecatapi
```

### Requisitos

- Node.js v14 o superior
- MongoDB (local o remoto)
- API Key de The Cat API (obtener en https://thecatapi.com/)

---

## Endpoints

### Health Check

#### GET /

Verifica que la API esté funcionando correctamente.

**Response:**
```json
{
  "mensaje": "API de Gatos funcionando correctamente",
  "endpoints": {
    "breeds": "GET /breeds",
    "breedById": "GET /breeds/:breedId",
    "breedSearch": "GET /breeds/search",
    "images": "GET /imagesByBreedId/:breedId",
    "login": "GET /login",
    "register": "POST /register"
  }
}
```

**Ejemplo cURL:**
```bash
curl http://localhost:3000/
```

---

## Autenticación

### POST /register

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**
- `name`: requerido, string
- `email`: requerido, string, único
- `password`: requerido, string (será encriptada)

**Response Success (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

**Response Error (400 Bad Request):**
```json
{
  "mensaje": "\"Nombre, email y contraseña son requeridos\""
}
```

**Response Error (409 Conflict):**
```json
{
  "mensaje": "Ya existe un usuario con ese correo"
}
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

---

### POST /login

Autentica un usuario existente.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**
- `email`: requerido, string
- `password`: requerido, string

**Response Success (200 OK):**
```json
{
  "status": 200,
  "mensaje": "Login exitoso",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Response Error (400 Bad Request):**
```json
{
  "mensaje": "\"Email y contraseña son requeridos\""
}
```

**Response Error (404 Not Found):**
```json
{
  "mensaje": "Usuario no encontrado"
}
```

**Response Error (401 Unauthorized):**
```json
{
  "mensaje": "Contraseña incorrecta"
}
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

---

## Razas de Gatos

### GET /breeds

Obtiene una lista con los nombres de todas las razas de gatos disponibles.

**Response Success (200 OK):**
```json
[
  "Abyssinian",
  "Aegean",
  "American Bobtail",
  "American Curl",
  "American Shorthair",
  ...
]
```

**Response Error (500 Internal Server Error):**
```json
{
  "mensaje": "Error al obtener las razas",
  "error": "descripción del error"
}
```

**Ejemplo cURL:**
```bash
curl http://localhost:3000/breeds
```

---

### GET /breeds/:breedId

Obtiene información específica de una raza por su ID.

**Parámetros de URL:**
- `breedId`: ID de la raza (ej: "abys", "aege", "beng")

**Response Success (200 OK):**
```json
{
  "name": "Abyssinian"
}
```

**Response Error (500 Internal Server Error):**
```json
{
  "mensaje": "Error al obtener las razas",
  "error": "descripción del error"
}
```

**Ejemplo cURL:**
```bash
curl http://localhost:3000/breeds/abys
```

---

### GET /breeds/search

Busca razas de gatos por nombre (búsqueda parcial).

**Query Parameters:**
- `q`: término de búsqueda (requerido)
- `attach_image`: "1" para incluir imagen de referencia (opcional)

**Response Success (200 OK):**
```json
[
  {
    "id": "abys",
    "name": "Abyssinian",
    "origin": "Egypt",
    "temperament": "Active, Energetic, Independent, Intelligent",
    "description": "The Abyssinian is easy to care for...",
    "life_span": "14 - 15",
    "weight": {
      "imperial": "7 - 10",
      "metric": "3 - 5"
    },
    "reference_image_id": "0XYvRd7oD",
    ...
  }
]
```

**Response Error (500 Internal Server Error):**
```json
{
  "mensaje": "Error al obtener las razas",
  "error": "descripción del error"
}
```

**Ejemplo cURL:**
```bash
# Búsqueda simple
curl "http://localhost:3000/breeds/search?q=aby"

# Búsqueda con imagen
curl "http://localhost:3000/breeds/search?q=persian&attach_image=1"
```

---

## Imágenes

### GET /imagesByBreedId/:breedId

Obtiene la URL de la imagen de referencia de una raza específica.

**Parámetros de URL:**
- `breedId`: ID de la raza (ej: "abys", "beng")

**Response Success (200 OK):**
```json
"https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg"
```

**Response Error (404 Not Found):**
```json
{
  "mensaje": "Imagen no encontrada"
}
```

**Response Error (500 Internal Server Error):**
```json
{
  "mensaje": "Error al obtener las razas",
  "error": "descripción del error"
}
```

**Ejemplo cURL:**
```bash
curl http://localhost:3000/imagesByBreedId/abys
```

---

## Códigos de Estado

La API utiliza los siguientes códigos de estado HTTP:

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos de solicitud inválidos |
| 401 | Unauthorized - Credenciales incorrectas |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto con el estado actual (ej: email duplicado) |
| 500 | Internal Server Error - Error del servidor |

---

## Ejemplos de Uso

### Flujo Completo de Usuario

#### 1. Registrar un nuevo usuario

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria@example.com",
    "password": "miPassword123"
  }'
```

#### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "miPassword123"
  }'
```

#### 3. Obtener lista de razas

```bash
curl http://localhost:3000/breeds
```

#### 4. Buscar una raza específica

```bash
curl "http://localhost:3000/breeds/search?q=persian"
```

#### 5. Obtener detalles de una raza

```bash
curl http://localhost:3000/breeds/pers
```

#### 6. Obtener imagen de una raza

```bash
curl http://localhost:3000/imagesByBreedId/pers
```

---

### Uso con JavaScript (Fetch API)

#### Registrar usuario

```javascript
const registro = async () => {
  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'María García',
      email: 'maria@example.com',
      password: 'miPassword123'
    })
  });

  const data = await response.json();
  console.log(data);
};
```

#### Login

```javascript
const login = async () => {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'maria@example.com',
      password: 'miPassword123'
    })
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Login exitoso:', data.usuario);
  } else {
    console.error('Error:', data.mensaje);
  }
};
```

#### Obtener razas

```javascript
const obtenerRazas = async () => {
  const response = await fetch('http://localhost:3000/breeds');
  const razas = await response.json();
  console.log('Razas disponibles:', razas);
};
```

#### Buscar raza

```javascript
const buscarRaza = async (termino) => {
  const response = await fetch(
    `http://localhost:3000/breeds/search?q=${termino}&attach_image=1`
  );
  const resultados = await response.json();
  console.log('Resultados:', resultados);
};

buscarRaza('persian');
```

#### Obtener imagen

```javascript
const obtenerImagen = async (breedId) => {
  const response = await fetch(
    `http://localhost:3000/imagesByBreedId/${breedId}`
  );
  const imageUrl = await response.json();
  console.log('URL de imagen:', imageUrl);
};

obtenerImagen('pers');
```

---

### Uso con Axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Registrar usuario
const registrar = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, userData);
    return data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};

// Login
const login = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, credentials);
    return data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};

// Obtener razas
const obtenerRazas = async () => {
  const { data } = await axios.get(`${API_URL}/breeds`);
  return data;
};

// Buscar raza
const buscarRaza = async (termino, conImagen = false) => {
  const { data } = await axios.get(`${API_URL}/breeds/search`, {
    params: {
      q: termino,
      attach_image: conImagen ? '1' : '0'
    }
  });
  return data;
};

// Obtener imagen
const obtenerImagen = async (breedId) => {
  const { data } = await axios.get(`${API_URL}/imagesByBreedId/${breedId}`);
  return data;
};
```

---

## IDs de Razas Comunes

Algunos IDs de razas populares para pruebas:

| ID | Nombre |
|----|--------|
| abys | Abyssinian |
| aege | Aegean |
| abob | American Bobtail |
| acur | American Curl |
| asho | American Shorthair |
| beng | Bengal |
| birm | Birman |
| bomb | Bombay |
| bslo | British Longhair |
| bsho | British Shorthair |
| bure | Burmese |
| cspa | Chartreux |
| munc | Munchkin |
| pers | Persian |
| ragd | Ragdoll |
| siam | Siamese |
| sphy | Sphynx |

---

## Notas Importantes

1. **CORS**: La API tiene CORS habilitado para todos los orígenes
2. **Contraseñas**: Se encriptan usando bcrypt antes de guardarlas en la base de datos
3. **Rate Limiting**: The Cat API puede tener límites de tasa. Considera implementar caché para producción
4. **Validación**: Todos los endpoints validan los datos de entrada
5. **Timestamps**: Los usuarios tienen campos `createdAt` y `updatedAt` automáticos
6. **Email**: Se almacena en minúsculas y se valida como único

---

## Troubleshooting

### Error de conexión a MongoDB

```
Error al conectar a MongoDB
```

**Solución**: Verificar que MongoDB esté ejecutándose y que `MONGODB_URI` en `.env` sea correcto.

### Error de API Key

```
Error al obtener las razas
```

**Solución**: Verificar que `API_KEY` en `.env` sea válida. Obtener una nueva en https://thecatapi.com/

### Puerto en uso

```
EADDRINUSE: address already in use
```

**Solución**: Cambiar el `PORT` en `.env` o detener el proceso que está usando el puerto 3000.

---

## Contacto y Soporte

Para más información sobre The Cat API, visita: https://thecatapi.com/

---

## Licencia

ISC
