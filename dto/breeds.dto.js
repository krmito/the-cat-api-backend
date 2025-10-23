class BreedDTO {
    constructor(breed) {
        this.id = breed.id;
        this.name = breed.name;
        this.origin = breed.origin;
        this.temperament = breed.temperament;
        this.description = breed.description;
        this.lifeSpan = breed.life_span;
        this.weight = {
            imperial: breed.weight?.imperial,
            metric: breed.weight?.metric
        };
        this.adaptability = breed.adaptability;
        this.affectionLevel = breed.affection_level;
        this.childFriendly = breed.child_friendly;
        this.dogFriendly = breed.dog_friendly;
        this.energyLevel = breed.energy_level;
        this.intelligence = breed.intelligence;
        this.socialNeeds = breed.social_needs;
        this.strangerFriendly = breed.stranger_friendly;
        this.wikipediaUrl = breed.wikipedia_url;
        this.imageId = breed.reference_image_id;
    }

    /**
     * @description Método estático para obtener solo nombres de razas
     * @param {array} breeds - Array de objetos de raza
     * @returns {array} - Array de nombres de razas
     */
    static getNamesArray(breeds) {
        return breeds.map(breed => breed.name);
    }

    // Método estático para DTO simplificado (solo info básica)
    static mapSimple(breed) {
        return {
            id: breed.id,
            name: breed.name,
            origin: breed.origin,
            temperament: breed.temperament
        };
    }

        static getBreedName(breed) {
        return {
            name: breed.name,
        };
    }

    // Método estático para array simplificado
    static mapSimpleArray(breeds) {
        return breeds.map(breed => BreedDTO.mapSimple(breed));
    }
}

module.exports = {
    BreedDTO
};