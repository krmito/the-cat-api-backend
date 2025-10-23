const ERROR_MESSAGES = {
    ERROR_GET_BREEDS: 'Error al obtener las razas',
    ERROR_GET_BREEDS_IMAGE: 'Error al obtener las imágenes de la raza',
    ERROR_IMAGE_NOT_FOUND: 'Imagen no encontrada',
    ERROR_INVALID_PASSWORD: 'Contraseña incorrecta',
    ERROR_USER_NOT_FOUND: 'Usuario no encontrado',
    ERROR_LOGIN: 'Error en el login',
    ERROR_REGISTER: 'Error en el registro',
}

const WARNING_MESSAGES = {
    WARNING_EMAIL_PASSWORD: '"Email y contraseña son requeridos"',
    WARNING_EMAIL_PASSWORD_NAME: '"Nombre, email y contraseña son requeridos"',
}

const SUCCESS_MESSAGES = {
    SUCCESS_GET_BREEDS: 'Razas de gatos obtenidas exitosamente',
    SUCCESS_LOGIN: 'Login exitoso'
}

module.exports = {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    WARNING_MESSAGES
};