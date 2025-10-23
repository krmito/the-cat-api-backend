const { Router } = require("express");
const axios = require("axios");
const { BreedDTO } = require("../dto/breeds.dto");

const { ERROR_MESSAGES } = require("../constants/constants");

const router = Router();

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;

/**
 * @description Retorna una lista de las razas de gatos disponibles en la API
 * @returns {array} - Lista de razas de gatos
 * @example
 * // Retorna ["abys", "Aegean"]
 */
router.get("/breeds", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/breeds`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    const breedNames = BreedDTO.getNamesArray(response.data);
    res.json(breedNames);
  } catch (error) {
    res.status(500).json({
      mensaje: ERROR_MESSAGES.ERROR_GET_BREEDS,
      error: error.message,
    });
  }
});

/**
 * @description Busca por palabras contenidas en los nombres, si se requiere la imagen en attach_image se envía 1
 * @param {string} breed_id - El ID de la raza del gato
 * @returns {object} - La información de la raza del gato
 */
router.get("/breeds/search", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/breeds/search`, {
      params: { q: req.query.q, attach_image: req.query.attach_image },
      headers: {
        "x-api-key": API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      mensaje: ERROR_MESSAGES.ERROR_GET_BREEDS,
      error: error.message,
    });
  }
});

/**
 * @description Debe retornar la información de la raza del gato
 * @param {string} breedId - El ID de la raza del gato
 * @returns {object} - La información de la raza del gato
 * @example
 * // Retorna { "name": "Abyssinian" }
 */
router.get("/breeds/:breedId", async (req, res) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/breeds/${req.params.breedId}`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );
    const breedName = BreedDTO.getBreedName(response.data);
    res.json(breedName);
  } catch (error) {
    res.status(axios.HttpStatusCode.InternalServerError).json({
      mensaje: ERROR_MESSAGES.ERROR_GET_BREEDS,
      error: error.message,
    });
  }
});

module.exports = router;
