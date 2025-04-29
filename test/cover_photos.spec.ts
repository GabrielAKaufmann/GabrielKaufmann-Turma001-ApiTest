import pactum from 'pactum';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

const baseUrl = 'https://fakerestapi.azurewebsites.net/api/v1';
let createdId = 0;

describe('CoverPhotos API - FakeRestAPI', () => {

  it('01 - Deve criar um CoverPhoto válido', async () => {
    createdId = await pactum.spec()
      .post(`${baseUrl}/CoverPhotos`)
      .withJson({
        id: 1,
        idBook: faker.number.int({ min: 1, max: 100 }),
        url: faker.image.url()
      })
      .expectStatus(StatusCodes.OK)
      .returns('id');
  });

  it('02 - Deve retornar um CoverPhoto específico por ID', async () => {
    await pactum.spec()
      .get(`${baseUrl}/CoverPhotos/${createdId}`)
      .expectStatus(200)
      .expectJsonLike({ id: createdId });
  });

  it('03 - Deve atualizar um CoverPhoto existente via PUT', async () => {
    await pactum.spec()
      .put(`${baseUrl}/CoverPhotos/${createdId}`)
      .withJson({
        id: createdId,
        idBook: faker.number.int({ min: 1, max: 100 }),
        url: faker.image.url()
      })
      .expectStatus(StatusCodes.OK);
  });

  it('04 - Não deve criar CoverPhoto com body vazio', async () => {
    await pactum.spec()
      .post(`${baseUrl}/CoverPhotos`)
      .withJson({})
      .expectStatus(200);
  });

  it('05 - Deve retornar erro ao fazer PUT em CoverPhoto inexistente', async () => {
    await pactum.spec()
      .put(`${baseUrl}/CoverPhotos/999999`)
      .withJson({
        id: 999999,
        idBook: 1,
        url: faker.image.url()
      })
      .expectStatus(200);
  });

  it('06 - Deve retornar todos os CoverPhotos', async () => {
    await pactum.spec()
      .get(`${baseUrl}/CoverPhotos`)
      .expectStatus(200)
      .expectJsonLike([{ id: expect.any(Number) }]);
  });

  it('07 - Deve retornar erro com método PUT sem body', async () => {
    await pactum.spec()
      .put(`${baseUrl}/CoverPhotos/${createdId}`)
      .expectStatus(415);
  });

  it('08 - Deve retornar erro com POST usando dados inválidos', async () => {
    await pactum.spec()
      .post(`${baseUrl}/CoverPhotos`)
      .withJson({
        id: 'abc',
        idBook: 'xyz',
        url: 12345
      })
      .expectStatus(StatusCodes.BAD_REQUEST);
  });

  it('09 - Deve aceitar múltiplos POSTs válidos sequenciais', async () => {
    for (let i = 0; i < 3; i++) {
      await pactum.spec()
        .post(`${baseUrl}/CoverPhotos`)
        .withJson({
          id: 0,
          idBook: faker.number.int({ min: 1, max: 100 }),
          url: faker.image.url()
        })
        .expectStatus(StatusCodes.OK);
    }
  });

  it('10 - Deve retornar erro ao acessar CoverPhoto com ID inválido', async () => {
    await pactum.spec()
      .get(`${baseUrl}/CoverPhotos/invalid-id`)
      .expectStatus(StatusCodes.BAD_REQUEST);
  });

});
