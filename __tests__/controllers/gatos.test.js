const request = require('supertest');
const express = require('express');
const axios = require('axios');
const gatosRouter = require('../../controllers/gatos');

// Mock de axios
jest.mock('axios');

// Mock de las constantes
jest.mock('../../constants/constants', () => ({
  ERROR_MESSAGES: {
    ERROR_GET_BREEDS: 'Error al obtener las razas'
  }
}));

// Mock del DTO
jest.mock('../../dto/breeds.dto', () => ({
  BreedDTO: {
    getNamesArray: jest.fn((data) => data.map(breed => breed.name)),
    getBreedName: jest.fn((data) => ({ name: data.name }))
  }
}));

let app;

beforeAll(() => {
  // Crear app de Express para pruebas
  app = express();
  app.use(express.json());
  app.use(gatosRouter);

  // Configurar variables de entorno
  process.env.API_KEY = 'test-api-key';
  process.env.API_BASE_URL = 'https://api.thecatapi.com/v1';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /breeds', () => {
  it('debería retornar una lista de nombres de razas', async () => {
    const mockBreeds = [
      { id: 'abys', name: 'Abyssinian' },
      { id: 'aege', name: 'Aegean' }
    ];

    axios.get.mockResolvedValue({ data: mockBreeds });

    const response = await request(app).get('/breeds');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(['Abyssinian', 'Aegean']);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/breeds',
      {
        headers: {
          'x-api-key': 'test-api-key'
        }
      }
    );
  });

  it('debería retornar 500 si hay un error en la API', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    const response = await request(app).get('/breeds');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('mensaje', 'Error al obtener las razas');
    expect(response.body).toHaveProperty('error', 'API Error');
  });
});

describe('GET /breeds/search', () => {
  it('debería buscar razas por nombre', async () => {
    const mockSearchResults = [
      { id: 'abys', name: 'Abyssinian', origin: 'Egypt' }
    ];

    axios.get.mockResolvedValue({ data: mockSearchResults });

    const response = await request(app)
      .get('/breeds/search')
      .query({ q: 'aby', attach_image: '1' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSearchResults);
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/breeds/search',
      {
        params: { q: 'aby', attach_image: '1' },
        headers: {
          'x-api-key': 'test-api-key'
        }
      }
    );
  });

  it('debería manejar búsquedas sin parámetro attach_image', async () => {
    const mockSearchResults = [
      { id: 'abys', name: 'Abyssinian' }
    ];

    axios.get.mockResolvedValue({ data: mockSearchResults });

    const response = await request(app)
      .get('/breeds/search')
      .query({ q: 'aby' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSearchResults);
  });

  it('debería retornar 500 si hay un error en la búsqueda', async () => {
    axios.get.mockRejectedValue(new Error('Search Error'));

    const response = await request(app)
      .get('/breeds/search')
      .query({ q: 'test' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('mensaje', 'Error al obtener las razas');
    expect(response.body).toHaveProperty('error', 'Search Error');
  });
});

describe('GET /breeds/:breedId', () => {
  it('debería retornar información de una raza específica', async () => {
    const mockBreed = {
      id: 'abys',
      name: 'Abyssinian',
      origin: 'Egypt',
      temperament: 'Active, Energetic'
    };

    axios.get.mockResolvedValue({ data: mockBreed });

    const response = await request(app).get('/breeds/abys');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: 'Abyssinian' });
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/breeds/abys',
      {
        headers: {
          'x-api-key': 'test-api-key'
        }
      }
    );
  });

  it('debería retornar 500 si hay un error al obtener la raza', async () => {
    axios.get.mockRejectedValue(new Error('Breed Not Found'));

    const response = await request(app).get('/breeds/invalidid');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('mensaje', 'Error al obtener las razas');
    expect(response.body).toHaveProperty('error', 'Breed Not Found');
  });
});
