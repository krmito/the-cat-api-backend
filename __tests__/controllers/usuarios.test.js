const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const usuariosRouter = require('../../controllers/usuarios');
const Usuario = require('../../models/usuarios');

// Mock de las constantes
jest.mock('../../constants/constants', () => ({
  SUCCESS_MESSAGES: {
    SUCCESS_LOGIN: 'Login exitoso'
  },
  ERROR_MESSAGES: {
    ERROR_USER_NOT_FOUND: 'Usuario no encontrado',
    ERROR_INVALID_PASSWORD: 'Contraseña incorrecta',
    ERROR_LOGIN: 'Error en el login',
    ERROR_REGISTER: 'Error en el registro'
  },
  WARNING_MESSAGES: {
    WARNING_EMAIL_PASSWORD: '"Email y contraseña son requeridos"',
    WARNING_EMAIL_PASSWORD_NAME: '"Nombre, email y contraseña son requeridos"'
  }
}));

// Definir las constantes globalmente para el código que las usa sin importarlas
global.ERROR_MESSAGES = {
  ERROR_USER_NOT_FOUND: 'Usuario no encontrado',
  ERROR_INVALID_PASSWORD: 'Contraseña incorrecta',
  ERROR_LOGIN: 'Error en el login',
  ERROR_REGISTER: 'Error en el registro'
};
global.WARNING_MESSAGES = {
  WARNING_EMAIL_PASSWORD: '"Email y contraseña son requeridos"',
  WARNING_EMAIL_PASSWORD_NAME: '"Nombre, email y contraseña son requeridos"'
};

let mongoServer;
let app;

beforeAll(async () => {
  // Crear servidor MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Desconectar cualquier conexión existente
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Conectar a MongoDB en memoria
  await mongoose.connect(mongoUri);

  // Crear app de Express para pruebas
  app = express();
  app.use(express.json());
  app.use(usuariosRouter);
});

afterAll(async () => {
  // Limpiar y cerrar conexiones
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Limpiar la base de datos antes de cada prueba
  await Usuario.deleteMany({});
});

describe('POST /login', () => {
  it('debería retornar 400 si falta el email', async () => {
    const response = await request(app)
      .post('/login')
      .send({ password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.mensaje).toBe('"Email y contraseña son requeridos"');
  });

  it('debería retornar 400 si falta la contraseña', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.mensaje).toBe('"Email y contraseña son requeridos"');
  });

  it('debería retornar 404 si el usuario no existe', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'noexiste@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(404);
    expect(response.body.mensaje).toBe('Usuario no encontrado');
  });

  it('debería retornar 401 si la contraseña es incorrecta', async () => {
    // Crear un usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);
    await Usuario.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'passwordincorrecta'
      });

    expect(response.status).toBe(401);
    expect(response.body.mensaje).toBe('Contraseña incorrecta');
  });

  it('debería retornar 200 y los datos del usuario si el login es exitoso', async () => {
    // Crear un usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);
    const usuario = await Usuario.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('mensaje', 'Login exitoso');
    expect(response.body.usuario).toHaveProperty('email', 'test@example.com');
    expect(response.body.usuario).toHaveProperty('id');
    expect(response.body.usuario).not.toHaveProperty('password');
  });
});

describe('POST /register', () => {
  it('debería retornar 400 si falta el nombre', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.mensaje).toBe('"Nombre, email y contraseña son requeridos"');
  });

  it('debería retornar 400 si falta el email', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.mensaje).toBe('"Nombre, email y contraseña son requeridos"');
  });

  it('debería retornar 400 si falta la contraseña', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'test@example.com'
      });

    expect(response.status).toBe(400);
    expect(response.body.mensaje).toBe('"Nombre, email y contraseña son requeridos"');
  });

  it('debería retornar 409 si el usuario ya existe', async () => {
    // Crear un usuario existente
    const hashedPassword = await bcrypt.hash('password123', 10);
    await Usuario.create({
      name: 'Existing User',
      email: 'existing@example.com',
      password: hashedPassword
    });

    const response = await request(app)
      .post('/register')
      .send({
        name: 'New User',
        email: 'existing@example.com',
        password: 'newpassword123'
      });

    expect(response.status).toBe(409);
    expect(response.body.mensaje).toBe('Ya existe un usuario con ese correo');
  });

  it('debería registrar un usuario exitosamente', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'New User');
    expect(response.body).toHaveProperty('email', 'newuser@example.com');
    expect(response.body).not.toHaveProperty('password');

    // Verificar que el usuario fue creado en la base de datos
    const usuario = await Usuario.findOne({ email: 'newuser@example.com' });
    expect(usuario).not.toBeNull();
    expect(usuario.name).toBe('New User');

    // Verificar que la contraseña fue hasheada
    const isMatch = await bcrypt.compare('password123', usuario.password);
    expect(isMatch).toBe(true);
  });
});
