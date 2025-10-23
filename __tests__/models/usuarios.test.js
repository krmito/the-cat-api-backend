const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Usuario = require('../../models/usuarios');

let mongoServer;

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

describe('Modelo Usuario', () => {
  it('debería crear un usuario con todos los campos requeridos', async () => {
    const usuarioData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123'
    };

    const usuario = new Usuario(usuarioData);
    const usuarioGuardado = await usuario.save();

    expect(usuarioGuardado._id).toBeDefined();
    expect(usuarioGuardado.name).toBe(usuarioData.name);
    expect(usuarioGuardado.email).toBe(usuarioData.email);
    expect(usuarioGuardado.password).toBe(usuarioData.password);
    expect(usuarioGuardado.createdAt).toBeDefined();
    expect(usuarioGuardado.updatedAt).toBeDefined();
  });

  it('debería convertir el email a minúsculas', async () => {
    const usuario = new Usuario({
      name: 'Test User',
      email: 'TEST@EXAMPLE.COM',
      password: 'password123'
    });

    const usuarioGuardado = await usuario.save();
    expect(usuarioGuardado.email).toBe('test@example.com');
  });

  it('debería eliminar espacios en blanco del nombre y email', async () => {
    const usuario = new Usuario({
      name: '  Test User  ',
      email: '  test@example.com  ',
      password: 'password123'
    });

    const usuarioGuardado = await usuario.save();
    expect(usuarioGuardado.name).toBe('Test User');
    expect(usuarioGuardado.email).toBe('test@example.com');
  });

  it('debería fallar si falta el nombre', async () => {
    const usuario = new Usuario({
      email: 'test@example.com',
      password: 'password123'
    });

    let error;
    try {
      await usuario.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.name.message).toBe('El nombre es requerido');
  });

  it('debería fallar si falta el email', async () => {
    const usuario = new Usuario({
      name: 'Test User',
      password: 'password123'
    });

    let error;
    try {
      await usuario.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.email.message).toBe('El email es requerido');
  });

  it('debería fallar si falta la contraseña', async () => {
    const usuario = new Usuario({
      name: 'Test User',
      email: 'test@example.com'
    });

    let error;
    try {
      await usuario.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
    expect(error.errors.password.message).toBe('La contraseña es requerida');
  });

  it('debería fallar si el email ya existe', async () => {
    const usuarioData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    await Usuario.create(usuarioData);

    const usuarioDuplicado = new Usuario({
      name: 'Another User',
      email: 'test@example.com',
      password: 'password456'
    });

    let error;
    try {
      await usuarioDuplicado.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // Código de error de duplicación en MongoDB
  });

  describe('findByEmail', () => {
    it('debería encontrar un usuario por email', async () => {
      const usuarioData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await Usuario.create(usuarioData);

      const usuario = await Usuario.findByEmail('test@example.com');

      expect(usuario).not.toBeNull();
      expect(usuario.name).toBe(usuarioData.name);
      expect(usuario.email).toBe(usuarioData.email);
    });

    it('debería retornar null si el usuario no existe', async () => {
      const usuario = await Usuario.findByEmail('noexiste@example.com');
      expect(usuario).toBeNull();
    });

    it('debería ser case-insensitive al buscar por email', async () => {
      await Usuario.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const usuario = await Usuario.findByEmail('TEST@EXAMPLE.COM');
      expect(usuario).not.toBeNull();
      expect(usuario.email).toBe('test@example.com');
    });
  });
});
