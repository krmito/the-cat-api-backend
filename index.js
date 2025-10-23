require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Variables de entorno
const PORT = process.env.PORT || 3000;

// Importar controladores
const gatosRouter = require('./controllers/gatos');
const usuariosRouter = require('./controllers/usuarios');
const imagenesRouter = require('./controllers/imagenes');

// Usar los routers
app.use(gatosRouter);
app.use(usuariosRouter);
app.use(imagenesRouter);

// Ruta de salud
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Gatos funcionando correctamente',
    endpoints: {
      breeds: 'GET /breeds',
      breedById: 'GET /breeds/:breedId',
      breedSearch: 'GET /breeds/search',
      images: 'GET /imagesByBreedId/:breedId',
      login: 'GET /login',
      register: 'POST /register'
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
