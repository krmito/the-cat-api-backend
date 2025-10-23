const { BreedDTO } = require('../../dto/breeds.dto');

describe('BreedDTO', () => {
  const mockBreed = {
    id: 'abys',
    name: 'Abyssinian',
    origin: 'Egypt',
    temperament: 'Active, Energetic, Independent, Intelligent',
    description: 'The Abyssinian is easy to care for, and a joy to have in your home.',
    life_span: '14 - 15',
    weight: {
      imperial: '7 - 10',
      metric: '3 - 5'
    },
    adaptability: 5,
    affection_level: 5,
    child_friendly: 3,
    dog_friendly: 4,
    energy_level: 5,
    intelligence: 5,
    social_needs: 5,
    stranger_friendly: 5,
    wikipedia_url: 'https://en.wikipedia.org/wiki/Abyssinian_(cat)',
    reference_image_id: '0XYvRd7oD'
  };

  describe('constructor', () => {
    it('debería crear un DTO con todos los campos mapeados correctamente', () => {
      const dto = new BreedDTO(mockBreed);

      expect(dto.id).toBe('abys');
      expect(dto.name).toBe('Abyssinian');
      expect(dto.origin).toBe('Egypt');
      expect(dto.temperament).toBe('Active, Energetic, Independent, Intelligent');
      expect(dto.description).toBe('The Abyssinian is easy to care for, and a joy to have in your home.');
      expect(dto.lifeSpan).toBe('14 - 15');
      expect(dto.weight).toEqual({
        imperial: '7 - 10',
        metric: '3 - 5'
      });
      expect(dto.adaptability).toBe(5);
      expect(dto.affectionLevel).toBe(5);
      expect(dto.childFriendly).toBe(3);
      expect(dto.dogFriendly).toBe(4);
      expect(dto.energyLevel).toBe(5);
      expect(dto.intelligence).toBe(5);
      expect(dto.socialNeeds).toBe(5);
      expect(dto.strangerFriendly).toBe(5);
      expect(dto.wikipediaUrl).toBe('https://en.wikipedia.org/wiki/Abyssinian_(cat)');
      expect(dto.imageId).toBe('0XYvRd7oD');
    });

    it('debería manejar weight undefined', () => {
      const breedSinPeso = { ...mockBreed, weight: undefined };
      const dto = new BreedDTO(breedSinPeso);

      expect(dto.weight).toEqual({
        imperial: undefined,
        metric: undefined
      });
    });

    it('debería manejar weight parcial', () => {
      const breedPesoParcial = {
        ...mockBreed,
        weight: { imperial: '7 - 10' }
      };
      const dto = new BreedDTO(breedPesoParcial);

      expect(dto.weight).toEqual({
        imperial: '7 - 10',
        metric: undefined
      });
    });
  });

  describe('getNamesArray', () => {
    it('debería retornar un array de nombres de razas', () => {
      const breeds = [
        { id: 'abys', name: 'Abyssinian' },
        { id: 'aege', name: 'Aegean' },
        { id: 'abob', name: 'American Bobtail' }
      ];

      const result = BreedDTO.getNamesArray(breeds);

      expect(result).toEqual(['Abyssinian', 'Aegean', 'American Bobtail']);
    });

    it('debería retornar un array vacío si se pasa un array vacío', () => {
      const result = BreedDTO.getNamesArray([]);
      expect(result).toEqual([]);
    });

    it('debería manejar razas sin nombre', () => {
      const breeds = [
        { id: 'abys', name: 'Abyssinian' },
        { id: 'test' },
        { id: 'aege', name: 'Aegean' }
      ];

      const result = BreedDTO.getNamesArray(breeds);
      expect(result).toEqual(['Abyssinian', undefined, 'Aegean']);
    });
  });

  describe('mapSimple', () => {
    it('debería retornar solo la información básica de la raza', () => {
      const result = BreedDTO.mapSimple(mockBreed);

      expect(result).toEqual({
        id: 'abys',
        name: 'Abyssinian',
        origin: 'Egypt',
        temperament: 'Active, Energetic, Independent, Intelligent'
      });
    });

    it('debería excluir campos no básicos', () => {
      const result = BreedDTO.mapSimple(mockBreed);

      expect(result).not.toHaveProperty('description');
      expect(result).not.toHaveProperty('lifeSpan');
      expect(result).not.toHaveProperty('weight');
      expect(result).not.toHaveProperty('adaptability');
    });
  });

  describe('getBreedName', () => {
    it('debería retornar solo el nombre de la raza', () => {
      const result = BreedDTO.getBreedName(mockBreed);

      expect(result).toEqual({
        name: 'Abyssinian'
      });
    });

    it('debería tener solo la propiedad name', () => {
      const result = BreedDTO.getBreedName(mockBreed);

      expect(Object.keys(result)).toEqual(['name']);
    });
  });

  describe('mapSimpleArray', () => {
    it('debería mapear un array de razas a formato simplificado', () => {
      const breeds = [
        {
          id: 'abys',
          name: 'Abyssinian',
          origin: 'Egypt',
          temperament: 'Active',
          description: 'A great cat',
          life_span: '14 - 15'
        },
        {
          id: 'aege',
          name: 'Aegean',
          origin: 'Greece',
          temperament: 'Affectionate',
          description: 'Another great cat',
          life_span: '9 - 12'
        }
      ];

      const result = BreedDTO.mapSimpleArray(breeds);

      expect(result).toEqual([
        {
          id: 'abys',
          name: 'Abyssinian',
          origin: 'Egypt',
          temperament: 'Active'
        },
        {
          id: 'aege',
          name: 'Aegean',
          origin: 'Greece',
          temperament: 'Affectionate'
        }
      ]);
    });

    it('debería retornar un array vacío si se pasa un array vacío', () => {
      const result = BreedDTO.mapSimpleArray([]);
      expect(result).toEqual([]);
    });
  });
});
