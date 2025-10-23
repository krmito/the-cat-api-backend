const { Router } = require("express");
const { ERROR_MESSAGES } = require("../constants/constants");
const axios = require("axios");
const HttpStatusCode = require("axios").HttpStatusCode;

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;

const router = Router();

/**
 * @description Debe retornar las imágenes asociadas a una raza específica de gato.
 * @param {string} breedId - El ID de la raza del gato
 * @returns {array} - Lista de URLs de imágenes del gato
 */
router.get("/imagesByBreedId/:breedId", async (req, res) => {
  try {
    const imageResponse = await getImageIdByBreedId(req.params.breedId);
    if (!imageResponse) {
      return res.status(HttpStatusCode.NotFound).json({
        mensaje: ERROR_MESSAGES.ERROR_IMAGE_NOT_FOUND,
      });
    }
    const imageId = imageResponse.data.reference_image_id;
    const response = await axios.get(`${API_BASE_URL}/images/${imageId}`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    const image = response?.data;
    res.json(image.url);
  } catch (error) {
    res.status(HttpStatusCode.InternalServerError).json({
      mensaje: ERROR_MESSAGES.ERROR_GET_BREEDS,
      error: error.message,
    });
  }
});

async function getImageIdByBreedId(breedId) {
  try {
    return await axios.get(`${API_BASE_URL}/breeds/${breedId}`, {
      headers: {
        "x-api-key": API_KEY,
      },
    });
  } catch (error) {
    console.error('Error fetching breed image:', error.message);
  }
}

module.exports = router;
