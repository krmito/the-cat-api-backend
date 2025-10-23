const { Router } = require("express");
const mongoose = require("mongoose");
const Usuario = require("../models/usuarios");
const HttpStatusCode = require("axios").HttpStatusCode;
const bcrypt = require("bcrypt");
const { SUCCESS_MESSAGES, ERROR_MESSAGES, WARNING_MESSAGES } = require("../constants/constants");
 


const router = Router();

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

/**
 * @description Debe permitir verificar en una colección de Mongo la existencia de un usuario y validar su contraseña y retorna la información del usuario.
 * @param {object} req.body - Datos de login del usuario
 * @returns {object} - Información del usuario si es válido
 */
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ mensaje: WARNING_MESSAGES.WARNING_EMAIL_PASSWORD });
    }

    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(HttpStatusCode.NotFound).json({ mensaje: ERROR_MESSAGES.ERROR_USER_NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(HttpStatusCode.Unauthorized).json({ mensaje: ERROR_MESSAGES.ERROR_INVALID_PASSWORD });
    }

    res.json({
      status: HttpStatusCode.Ok,
      mensaje: SUCCESS_MESSAGES.SUCCESS_LOGIN,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      }
    });
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ mensaje: ERROR_MESSAGES.ERROR_LOGIN, error: error.message });
  }
});

/**
 * @description Permite registrar un usuario con sus datos básicos.
 * @param {object} req.body - Datos básicos de registro del usuario
 * @returns {object} - Información del usuario registrado
 * @status {201} - Usuario registrado con éxito
 * @status {500} - Error en el servidor
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ mensaje: WARNING_MESSAGES.WARNING_EMAIL_PASSWORD_NAME });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res
        .status(HttpStatusCode.Conflict)
        .json({ mensaje: "Ya existe un usuario con ese correo" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const usuarioGuardado = await nuevoUsuario.save();
    const { password: _, ...usuarioSinPassword } = usuarioGuardado.toObject();
    res.status(HttpStatusCode.Created).json(usuarioSinPassword);
  } catch (error) {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ mensaje: ERROR_MESSAGES.ERROR_REGISTER, error: error.message });
  }
});

module.exports = router;
