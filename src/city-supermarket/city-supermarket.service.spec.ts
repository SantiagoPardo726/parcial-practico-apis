import { Test, TestingModule } from '@nestjs/testing';
import { CitySupermarketService } from './city-supermarket.service';
import { Repository } from 'typeorm';
import { CityEntity } from '../city/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { get } from 'http';
import { getRepositoryToken } from '@nestjs/typeorm';

enum Countries{
  ARGENTINA = 'Argentina',
  ECUADOR = 'Ecuador',
  Paraguay = 'Paraguay',
}

describe('CitySupermarketService', () => {
  let service: CitySupermarketService;
  let CityRepository: Repository<CityEntity>;
  let SupermarketRepository: Repository<SupermarketEntity>;
  let city: CityEntity;
  let supermarketsList: SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);
    CityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    SupermarketRepository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    SupermarketRepository.clear();
    CityRepository.clear();

    supermarketsList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket: SupermarketEntity = await SupermarketRepository.save({
        name: faker.company.name(),
        longitude: faker.number.int(),
        latitude: faker.number.int(),
        website: faker.internet.url(),
      });
      supermarketsList.push(supermarket);
    }
    const countries = Object.values(Countries);
    city = await CityRepository.save({
      name: faker.location.city.name,
      country: countries[Math.floor(Math.random() * countries.length)] as Countries,
      population: faker.number.int(),
      supermarkets: supermarketsList,
    });
  };

  it('addSupermarketCity should add an supermarket to a city', async () => {
    const newSupermarket: SupermarketEntity = await SupermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.number.int(),
      latitude: faker.number.int(),
      website: faker.internet.url(),
    });

    const newCity: CityEntity = await CityRepository.save({
      name: faker.location.city.name,
      country: faker.location.country.name,
      population: faker.number.int()
    });

    const result: CityEntity = await service.addSupermarketCity(
      newCity.id,
      newSupermarket.id,
    );

    expect(result.supermarkets.length).toBe(1);
    expect(result.supermarkets[0]).not.toBeNull();
    expect(result.supermarkets[0].name).toBe(newSupermarket.name);
    expect(result.supermarkets[0].longitude).toBe(newSupermarket.longitude);
    expect(result.supermarkets[0].latitude).toBe(newSupermarket.latitude);
    expect(result.supermarkets[0].website).toBe(newSupermarket.website);
  });

  it('addSupermarketCity should thrown exception for an invalid supermarket', async () => {
    const newCity: CityEntity = await CityRepository.save({
      name: faker.location.city.name,
      country: faker.location.country.name,
      population: faker.number.int()
    });

    await expect(() =>
      service.addSupermarketCity(newCity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
  it('addSupermarketCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await SupermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.number.int(),
      latitude: faker.number.int(),
      website: faker.internet.url(),
    });

    await expect(() =>
      service.addSupermarketCity('0', newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
  it('findSupermarketByCityIdsupermarketId should return supermarket by city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    const storedSupermarket: SupermarketEntity =
      await service.findSupermarketByCityIdsupermarketId(city.id, supermarket.id);
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toBe(supermarket.name);
    expect(storedSupermarket.longitude).toBe(supermarket.longitude);
    expect(storedSupermarket.latitude).toBe(supermarket.latitude);
    expect(storedSupermarket.website).toBe(supermarket.website);
  });
  it('indSupermarketByCityIdsupermarketId should throw an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.findSupermarketByCityIdsupermarketId(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
  it('findSupermarketByCityIdsupermarketId should throw an exception for an invalid city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await expect(() =>
      service.findSupermarketByCityIdsupermarketId('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
  it('findSupermarketByCityIdsupermarketId should throw an exception for an supermarket not associated to the city', async () => {
    const newSupermarket: SupermarketEntity = await SupermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.number.int(),
      latitude: faker.number.int(),
      website: faker.internet.url(),
    });

    await expect(() =>
      service.findSupermarketByCityIdsupermarketId(city.id, newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });
  it('findSupermarketsByCityId should return supermarkets by city', async () => {
    const supermarkets: SupermarketEntity[] = await service.findSupermarketsByCityId(
      city.id,
    );
    expect(supermarkets.length).toBe(5);
  });
  it('findSupermarketsByCityId should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketsByCityId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
  it('associateSupermarketsCity should update supermarkets list for a city', async () => {
    const newSupermarket: SupermarketEntity = await SupermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.number.int(),
      latitude: faker.number.int(),
      website: faker.internet.url(),
    });

    const updatedCity: CityEntity = await service.associateSupermarketsCity(
      city.id,
      [newSupermarket],
    );
    expect(updatedCity.supermarkets.length).toBe(1);

    expect(updatedCity.supermarkets[0].name).toBe(newSupermarket.name);
    expect(updatedCity.supermarkets[0].latitude).toBe(newSupermarket.latitude);
    expect(updatedCity.supermarkets[0].longitude).toBe(newSupermarket.longitude);
    expect(updatedCity.supermarkets[0].website).toBe(newSupermarket.website);
  });
  it('associateSupermarketsCity should throw an exception for an invalid city', async () => {
    const newSupermarket: SupermarketEntity = await SupermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.number.int(),
      latitude: faker.number.int(),
      website: faker.internet.url(),
    });

    await expect(() =>
      service.associateSupermarketsCity('0', [newSupermarket]),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
  it('associateSupermarketsCity should throw an exception for an invalid supermarket', async () => {
    const newSupermarket: SupermarketEntity = supermarketsList[0];
    newSupermarket.id = '0';

    await expect(() =>
      service.associateSupermarketsCity(city.id, [newSupermarket]),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
  it('deleteSupermarketCity should remove an supermarket from a city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];

    await service.deleteSupermarketCity(city.id, supermarket.id);

    const storedCity: CityEntity = await CityRepository.findOne({
      where: { id: city.id },
      relations: ['supermarkets'],
    });
    const deletedSupermarket: SupermarketEntity = storedCity.supermarkets.find(
      (a) => a.id === supermarket.id,
    );

    expect(deletedSupermarket).toBeUndefined();
  });
  it('deleteSupermarketCity should thrown an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.deleteSupermarketCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
  it('deleteSupermarketCity should thrown an exception for an invalid city', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await expect(() =>
      service.deleteSupermarketCity('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
  it('deleteSupermarketCity should thrown an exception for an non asocciated supermarket', async () => {
    const newSupermarket: SupermarketEntity = await SupermarketRepository.save({
      name: faker.company.name(),
      longitude: faker.number.int(),
      latitude: faker.number.int(),
      website: faker.internet.url(),
    });

    await expect(() =>
      service.deleteSupermarketCity(city.id, newSupermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });
});
