const request = require('supertest');
const express = require('express');
const axios = require('axios');
const imagenesRouter = require('../../controllers/imagenes');

// Mock de axios
jest.mock('axios');

// Mock de las constantes
jest.mock('../../constants/constants', () => ({
  ERROR_MESSAGES: {
    ERROR_GET_BREEDS: 'Error al obtener las razas',
    ERROR_IMAGE_NOT_FOUND: 'Imagen no encontrada'
  }
}));

let app;

beforeAll(() => {
  // Crear app de Express para pruebas
  app = express();
  app.use(express.json());
  app.use(imagenesRouter);

  // Configurar variables de entorno
  process.env.API_KEY = 'test-api-key';
  process.env.API_BASE_URL = 'https://api.thecatapi.com/v1';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /imagesByBreedId/:breedId', () => {
  it('debería retornar la URL de la imagen de una raza', async () => {
    const mockBreed = {
      data: {
        id: 'abys',
        name: 'Abyssinian',
        reference_image_id: 'abc123'
      }
    };

    const mockImage = {
      data: {
        id: 'abc123',
        url: 'https://cdn2.thecatapi.com/images/abc123.jpg',
        width: 1200,
        height: 800
      }
    };

    // Primer llamado para obtener el reference_image_id
    axios.get.mockResolvedValueOnce(mockBreed);
    // Segundo llamado para obtener la información de la imagen
    axios.get.mockResolvedValueOnce(mockImage);

    const response = await request(app).get('/imagesByBreedId/abys');

    expect(response.status).toBe(200);
    expect(response.body).toBe('https://cdn2.thecatapi.com/images/abc123.jpg');

    // Verificar que se hicieron ambas llamadas
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenNthCalledWith(1,
      'https://api.thecatapi.com/v1/breeds/abys',
      {
        headers: {
          'x-api-key': 'test-api-key'
        }
      }
    );
    expect(axios.get).toHaveBeenNthCalledWith(2,
      'https://api.thecatapi.com/v1/images/abc123',
      {
        headers: {
          'x-api-key': 'test-api-key'
        }
      }
    );
  });

  it('debería retornar 404 si no se encuentra el reference_image_id', async () => {
    // Simular que getImageIdByBreedId retorna null/undefined
    axios.get.mockResolvedValueOnce(null);

    const response = await request(app).get('/imagesByBreedId/invalidid');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('mensaje', 'Imagen no encontrada');
  });

  it('debería retornar 500 si hay un error al obtener la imagen', async () => {
    const mockBreed = {
      data: {
        id: 'abys',
        reference_image_id: 'abc123'
      }
    };

    // Primera llamada exitosa, segunda falla
    axios.get.mockResolvedValueOnce(mockBreed);
    axios.get.mockRejectedValueOnce(new Error('Image API Error'));

    const response = await request(app).get('/imagesByBreedId/abys');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('mensaje', 'Error al obtener las razas');
    expect(response.body).toHaveProperty('error', 'Image API Error');
  });

  it('debería manejar errores cuando la raza no existe', async () => {
    // Simular error en la primera llamada
    axios.get.mockRejectedValueOnce(new Error('Breed not found'));

    const response = await request(app).get('/imagesByBreedId/noexiste');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('mensaje', 'Imagen no encontrada');
  });
});
