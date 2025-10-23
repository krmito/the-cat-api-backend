# Ejemplos de Uso de la API

Este documento contiene ejemplos prácticos de cómo usar todos los endpoints de la API.

## Índice
- [Prerequisitos](#prerequisitos)
- [Variables de Entorno](#variables-de-entorno)
- [Ejemplos con cURL](#ejemplos-con-curl)
- [Ejemplos con HTTPie](#ejemplos-con-httpie)
- [Ejemplos con JavaScript](#ejemplos-con-javascript)
- [Ejemplos con Python](#ejemplos-con-python)
- [Casos de Uso Completos](#casos-de-uso-completos)

---

## Prerequisitos

Asegúrate de que el servidor esté corriendo:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## Variables de Entorno

Para los ejemplos, usaremos:

```bash
export API_URL="http://localhost:3000"
```

---

## Ejemplos con cURL

### 1. Health Check

```bash
curl -X GET "$API_URL/"
```

**Respuesta esperada:**
```json
{
  "mensaje": "API de Gatos funcionando correctamente",
  "endpoints": { ... }
}
```

---

### 2. Registrar un Usuario

```bash
curl -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria@example.com",
    "password": "miPassword123"
  }'
```

**Respuesta esperada (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "María García",
  "email": "maria@example.com",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

---

### 3. Login

```bash
curl -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "miPassword123"
  }'
```

**Respuesta esperada (200):**
```json
{
  "status": 200,
  "mensaje": "Login exitoso",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "email": "maria@example.com"
  }
}
```

---

### 4. Obtener Todas las Razas

```bash
curl -X GET "$API_URL/breeds"
```

**Respuesta esperada (200):**
```json
[
  "Abyssinian",
  "Aegean",
  "American Bobtail",
  ...
]
```

---

### 5. Obtener Raza por ID

```bash
curl -X GET "$API_URL/breeds/abys"
```

**Respuesta esperada (200):**
```json
{
  "name": "Abyssinian"
}
```

---

### 6. Buscar Razas (sin imagen)

```bash
curl -X GET "$API_URL/breeds/search?q=persian"
```

---

### 7. Buscar Razas (con imagen)

```bash
curl -X GET "$API_URL/breeds/search?q=bengal&attach_image=1"
```

**Respuesta esperada (200):**
```json
[
  {
    "id": "beng",
    "name": "Bengal",
    "origin": "United States",
    "temperament": "Alert, Agile, Energetic, Demanding, Intelligent",
    "description": "Bengals are a lot of fun to live with...",
    "life_span": "12 - 15",
    "reference_image_id": "O3btzLlsO",
    ...
  }
]
```

---

### 8. Obtener Imagen por Raza

```bash
curl -X GET "$API_URL/imagesByBreedId/beng"
```

**Respuesta esperada (200):**
```json
"https://cdn2.thecatapi.com/images/O3btzLlsO.jpg"
```

---

## Ejemplos con HTTPie

HTTPie es una herramienta CLI más amigable que cURL. Instalar con: `pip install httpie`

### Registrar Usuario

```bash
http POST "$API_URL/register" \
  name="Pedro López" \
  email="pedro@example.com" \
  password="pass123"
```

---

### Login

```bash
http POST "$API_URL/login" \
  email="pedro@example.com" \
  password="pass123"
```

---

### Obtener Razas

```bash
http GET "$API_URL/breeds"
```

---

### Buscar Razas

```bash
http GET "$API_URL/breeds/search" q=="persian" attach_image==1
```

---

### Obtener Imagen

```bash
http GET "$API_URL/imagesByBreedId/pers"
```

---

## Ejemplos con JavaScript

### Usando Fetch API

```javascript
const API_URL = 'http://localhost:3000';

// 1. Registrar usuario
async function registrarUsuario() {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Ana Martínez',
        email: 'ana@example.com',
        password: 'ana123'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje);
    }

    const usuario = await response.json();
    console.log('Usuario registrado:', usuario);
    return usuario;
  } catch (error) {
    console.error('Error al registrar:', error.message);
  }
}

// 2. Login
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje);
    }

    const data = await response.json();
    console.log('Login exitoso:', data.usuario);
    return data;
  } catch (error) {
    console.error('Error al hacer login:', error.message);
  }
}

// 3. Obtener todas las razas
async function obtenerRazas() {
  try {
    const response = await fetch(`${API_URL}/breeds`);
    const razas = await response.json();
    console.log('Razas disponibles:', razas);
    return razas;
  } catch (error) {
    console.error('Error al obtener razas:', error);
  }
}

// 4. Buscar raza
async function buscarRaza(termino, conImagen = false) {
  try {
    const url = new URL(`${API_URL}/breeds/search`);
    url.searchParams.append('q', termino);
    if (conImagen) {
      url.searchParams.append('attach_image', '1');
    }

    const response = await fetch(url);
    const resultados = await response.json();
    console.log('Resultados de búsqueda:', resultados);
    return resultados;
  } catch (error) {
    console.error('Error al buscar raza:', error);
  }
}

// 5. Obtener información de raza
async function obtenerRaza(breedId) {
  try {
    const response = await fetch(`${API_URL}/breeds/${breedId}`);
    const raza = await response.json();
    console.log('Información de raza:', raza);
    return raza;
  } catch (error) {
    console.error('Error al obtener raza:', error);
  }
}

// 6. Obtener imagen
async function obtenerImagen(breedId) {
  try {
    const response = await fetch(`${API_URL}/imagesByBreedId/${breedId}`);
    const imageUrl = await response.json();
    console.log('URL de imagen:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error al obtener imagen:', error);
  }
}

// Uso:
registrarUsuario();
login('ana@example.com', 'ana123');
obtenerRazas();
buscarRaza('persian', true);
obtenerRaza('pers');
obtenerImagen('pers');
```

---

### Usando Axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 1. Registrar usuario
async function registrarUsuario(userData) {
  try {
    const { data } = await api.post('/register', userData);
    console.log('Usuario registrado:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// 2. Login
async function login(credentials) {
  try {
    const { data } = await api.post('/login', credentials);
    console.log('Login exitoso:', data.usuario);
    return data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// 3. Obtener razas
async function obtenerRazas() {
  try {
    const { data } = await api.get('/breeds');
    console.log('Total de razas:', data.length);
    return data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// 4. Buscar raza
async function buscarRaza(termino, conImagen = false) {
  try {
    const { data } = await api.get('/breeds/search', {
      params: {
        q: termino,
        attach_image: conImagen ? '1' : '0'
      }
    });
    console.log('Resultados:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// 5. Obtener raza por ID
async function obtenerRaza(breedId) {
  try {
    const { data } = await api.get(`/breeds/${breedId}`);
    console.log('Raza:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// 6. Obtener imagen
async function obtenerImagen(breedId) {
  try {
    const { data } = await api.get(`/imagesByBreedId/${breedId}`);
    console.log('Imagen URL:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Uso:
(async () => {
  await registrarUsuario({
    name: 'Carlos Ruiz',
    email: 'carlos@example.com',
    password: 'carlos123'
  });

  await login({
    email: 'carlos@example.com',
    password: 'carlos123'
  });

  const razas = await obtenerRazas();
  const resultados = await buscarRaza('bengal', true);
  const raza = await obtenerRaza('beng');
  const imagen = await obtenerImagen('beng');
})();
```

---

## Ejemplos con Python

### Usando requests

```python
import requests
import json

API_URL = 'http://localhost:3000'

# 1. Registrar usuario
def registrar_usuario(name, email, password):
    url = f'{API_URL}/register'
    data = {
        'name': name,
        'email': email,
        'password': password
    }

    response = requests.post(url, json=data)

    if response.status_code == 201:
        print('Usuario registrado:', response.json())
        return response.json()
    else:
        print('Error:', response.json())
        return None

# 2. Login
def login(email, password):
    url = f'{API_URL}/login'
    data = {
        'email': email,
        'password': password
    }

    response = requests.post(url, json=data)

    if response.status_code == 200:
        print('Login exitoso:', response.json()['usuario'])
        return response.json()
    else:
        print('Error:', response.json())
        return None

# 3. Obtener razas
def obtener_razas():
    url = f'{API_URL}/breeds'
    response = requests.get(url)

    if response.status_code == 200:
        razas = response.json()
        print(f'Total de razas: {len(razas)}')
        return razas
    else:
        print('Error:', response.json())
        return None

# 4. Buscar raza
def buscar_raza(termino, con_imagen=False):
    url = f'{API_URL}/breeds/search'
    params = {'q': termino}

    if con_imagen:
        params['attach_image'] = '1'

    response = requests.get(url, params=params)

    if response.status_code == 200:
        print('Resultados:', response.json())
        return response.json()
    else:
        print('Error:', response.json())
        return None

# 5. Obtener raza por ID
def obtener_raza(breed_id):
    url = f'{API_URL}/breeds/{breed_id}'
    response = requests.get(url)

    if response.status_code == 200:
        print('Raza:', response.json())
        return response.json()
    else:
        print('Error:', response.json())
        return None

# 6. Obtener imagen
def obtener_imagen(breed_id):
    url = f'{API_URL}/imagesByBreedId/{breed_id}'
    response = requests.get(url)

    if response.status_code == 200:
        print('URL de imagen:', response.json())
        return response.json()
    else:
        print('Error:', response.json())
        return None

# Uso:
if __name__ == '__main__':
    # Registrar y hacer login
    registrar_usuario('Laura Gómez', 'laura@example.com', 'laura123')
    login('laura@example.com', 'laura123')

    # Obtener información de gatos
    razas = obtener_razas()
    buscar_raza('persian', True)
    obtener_raza('pers')
    obtener_imagen('pers')
```

---

## Casos de Uso Completos

### Caso 1: Registro y Exploración de Razas

```bash
#!/bin/bash

API_URL="http://localhost:3000"

echo "=== Registro de usuario ==="
curl -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Demo",
    "email": "demo@example.com",
    "password": "demo123"
  }'

echo -e "\n\n=== Login ==="
curl -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo123"
  }'

echo -e "\n\n=== Obtener lista de razas ==="
curl "$API_URL/breeds"

echo -e "\n\n=== Obtener detalles de Abyssinian ==="
curl "$API_URL/breeds/abys"

echo -e "\n\n=== Obtener imagen de Abyssinian ==="
curl "$API_URL/imagesByBreedId/abys"
```

---

### Caso 2: Búsqueda y Filtrado

```javascript
// Buscar todas las razas que contengan "short"
async function buscarRazasShorthair() {
  const resultados = await fetch(
    'http://localhost:3000/breeds/search?q=short&attach_image=1'
  );
  const razas = await resultados.json();

  console.log(`Encontradas ${razas.length} razas:`);
  razas.forEach(raza => {
    console.log(`- ${raza.name} (${raza.origin})`);
  });
}

buscarRazasShorthair();
```

---

### Caso 3: Galería de Imágenes

```javascript
// Obtener imágenes de múltiples razas
async function crearGaleria(breedIds) {
  const imagenes = await Promise.all(
    breedIds.map(async (id) => {
      try {
        const response = await fetch(
          `http://localhost:3000/imagesByBreedId/${id}`
        );
        const url = await response.json();
        return { id, url };
      } catch (error) {
        console.error(`Error obteniendo imagen de ${id}:`, error);
        return null;
      }
    })
  );

  return imagenes.filter(img => img !== null);
}

// Uso
const razasPopulares = ['abys', 'beng', 'pers', 'siam', 'ragd'];
crearGaleria(razasPopulares).then(galeria => {
  console.log('Galería creada:', galeria);
});
```

---

### Caso 4: Validación de Errores

```bash
echo "=== Intento de login con credenciales incorrectas ==="
curl -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "noexiste@example.com",
    "password": "wrongpass"
  }'
# Esperado: 404 - Usuario no encontrado

echo -e "\n\n=== Intento de registro sin campos requeridos ==="
curl -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "incompleto@example.com"
  }'
# Esperado: 400 - Campos requeridos faltantes

echo -e "\n\n=== Intento de obtener raza inexistente ==="
curl "$API_URL/breeds/noexiste"
# Esperado: 500 - Error al obtener la raza
```

---

## Scripts de Prueba Automatizados

### test-api.sh

```bash
#!/bin/bash

API_URL="http://localhost:3000"
EMAIL="test_$(date +%s)@example.com"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Iniciando pruebas de la API..."

# Test 1: Health Check
echo -e "\n${GREEN}Test 1: Health Check${NC}"
response=$(curl -s "$API_URL/")
if [[ $response == *"API de Gatos funcionando correctamente"* ]]; then
  echo "✓ Health check exitoso"
else
  echo "✗ Health check falló"
fi

# Test 2: Registro
echo -e "\n${GREEN}Test 2: Registro de usuario${NC}"
response=$(curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$EMAIL\",
    \"password\": \"test123\"
  }")
if [[ $response == *"$EMAIL"* ]]; then
  echo "✓ Registro exitoso"
else
  echo "✗ Registro falló"
fi

# Test 3: Login
echo -e "\n${GREEN}Test 3: Login${NC}"
response=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"test123\"
  }")
if [[ $response == *"Login exitoso"* ]]; then
  echo "✓ Login exitoso"
else
  echo "✗ Login falló"
fi

# Test 4: Obtener razas
echo -e "\n${GREEN}Test 4: Obtener razas${NC}"
response=$(curl -s "$API_URL/breeds")
if [[ $response == *"Abyssinian"* ]]; then
  echo "✓ Obtener razas exitoso"
else
  echo "✗ Obtener razas falló"
fi

# Test 5: Buscar raza
echo -e "\n${GREEN}Test 5: Buscar raza${NC}"
response=$(curl -s "$API_URL/breeds/search?q=persian")
if [[ $response == *"persian"* ]] || [[ $response == *"Persian"* ]]; then
  echo "✓ Búsqueda exitosa"
else
  echo "✗ Búsqueda falló"
fi

echo -e "\n${GREEN}Pruebas completadas${NC}"
```

Hacer ejecutable: `chmod +x test-api.sh`

---

## Notas Finales

- Todos los endpoints retornan JSON
- Los errores incluyen un campo `mensaje` descriptivo
- Para producción, considera agregar autenticación JWT
- Los IDs de razas más comunes están en el API_README.md
