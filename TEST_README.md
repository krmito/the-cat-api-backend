# Pruebas Unitarias del Backend

## Descripción

Este proyecto incluye pruebas unitarias completas para el backend utilizando Jest. Las pruebas cubren todos los controladores, modelos y DTOs del sistema.

## Requisitos

- Node.js v14 o superior
- npm o yarn

## Instalación de Dependencias

```bash
npm install
```

Las dependencias de pruebas incluyen:
- `jest`: Framework de pruebas
- `supertest`: Para pruebas de APIs HTTP
- `mongodb-memory-server`: Base de datos MongoDB en memoria para pruebas
- `@types/jest`: Tipos de TypeScript para Jest

## Ejecutar las Pruebas

### Ejecutar todas las pruebas con cobertura

```bash
npm test
```

### Ejecutar pruebas en modo watch (desarrollo)

```bash
npm run test:watch
```

## Estructura de Pruebas

```
backend/
├── __tests__/
│   ├── controllers/
│   │   ├── usuarios.test.js       # Pruebas de autenticación y registro
│   │   ├── gatos.test.js          # Pruebas de endpoints de razas de gatos
│   │   └── imagenes.test.js       # Pruebas de endpoints de imágenes
│   ├── models/
│   │   └── usuarios.test.js       # Pruebas del modelo de usuarios
│   ├── dto/
│   │   └── breeds.dto.test.js     # Pruebas del DTO de razas
│   └── setup.js                   # Configuración global de pruebas
├── jest.config.js                 # Configuración de Jest
└── package.json
```

## Cobertura de Pruebas

Las pruebas actuales cubren:

### Controladores

#### `usuarios.js` (92.5% coverage)
- ✓ POST /login
  - Validación de campos requeridos (email y password)
  - Verificación de existencia del usuario
  - Validación de contraseña
  - Login exitoso con credenciales válidas
- ✓ POST /register
  - Validación de campos requeridos (name, email, password)
  - Prevención de duplicación de usuarios
  - Registro exitoso de nuevos usuarios
  - Encriptación de contraseñas

#### `gatos.js` (100% coverage)
- ✓ GET /breeds
  - Obtención de lista de razas
  - Manejo de errores de API
- ✓ GET /breeds/search
  - Búsqueda de razas por nombre
  - Parámetros opcionales (attach_image)
  - Manejo de errores
- ✓ GET /breeds/:breedId
  - Obtención de información específica de una raza
  - Manejo de errores

#### `imagenes.js` (100% coverage)
- ✓ GET /imagesByBreedId/:breedId
  - Obtención de URL de imagen por ID de raza
  - Manejo de errores cuando no existe imagen
  - Manejo de errores de API

### Modelos

#### `usuarios.js` (100% coverage)
- ✓ Validaciones de campos requeridos
- ✓ Transformación de datos (lowercase, trim)
- ✓ Índice único en email
- ✓ Método estático `findByEmail`
- ✓ Timestamps automáticos

### DTOs

#### `breeds.dto.js` (100% coverage)
- ✓ Constructor con mapeo de campos
- ✓ Método `getNamesArray`
- ✓ Método `mapSimple`
- ✓ Método `getBreedName`
- ✓ Método `mapSimpleArray`

## Cobertura Total

```
File            | % Stmts | % Branch | % Funcs | % Lines |
----------------|---------|----------|---------|---------|
All files       |   97.41 |      100 |   94.11 |   97.36 |
 controllers    |   96.55 |      100 |   88.88 |   96.55 |
 dto            |     100 |      100 |     100 |     100 |
 models         |     100 |      100 |     100 |     100 |
```

## Configuración de Jest

El archivo `jest.config.js` incluye:
- Entorno de pruebas: Node.js
- Setup inicial en `__tests__/setup.js`
- Patrones de archivos de prueba: `**/__tests__/**/*.test.js`
- Cobertura mínima requerida: 50% en todas las métricas
- Exclusión de `node_modules` del coverage

## Mocks y Configuración

### Variables de Entorno

Las pruebas configuran las siguientes variables de entorno en `__tests__/setup.js`:
- `API_KEY`: Clave de API de prueba
- `API_BASE_URL`: URL base de la API de gatos
- `MONGODB_URI`: URI de MongoDB (usado por mongodb-memory-server)

### Mocks Implementados

1. **Axios**: Se mockea para simular respuestas de la API externa
2. **Constantes**: Se mockean los mensajes de error y éxito
3. **MongoDB**: Se usa MongoDB Memory Server para pruebas aisladas

## Buenas Prácticas Implementadas

1. **Aislamiento de Pruebas**: Cada suite de pruebas es independiente
2. **Limpieza de Datos**: Se limpian las colecciones entre pruebas
3. **Pruebas de Casos Edge**: Se prueban casos de error y validación
4. **Coverage Reports**: Se genera reporte de cobertura automáticamente
5. **Mocks Apropiados**: Se mockean dependencias externas (API, base de datos)

## Notas Importantes

- Las pruebas usan MongoDB Memory Server, por lo que no necesitan una instancia real de MongoDB
- Los mocks de axios simulan las respuestas de la API de gatos
- Las pruebas de usuarios requieren bcrypt para el hash de contraseñas
- Los console.log en el código de producción aparecen en la salida de las pruebas

## Problemas Conocidos

El código actual de `controllers/usuarios.js` tiene las siguientes observaciones:
1. No importa `ERROR_MESSAGES` y `WARNING_MESSAGES` (las usa como globales)
2. El login retorna `usuario.nombre` que es `undefined` (debería ser `usuario.name`)

Estas son limitaciones del código original que las pruebas trabajan alrededor, pero deberían corregirse en producción.
