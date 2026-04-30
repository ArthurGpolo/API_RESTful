// tests/integration/categories.test.js
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import { clearDatabase, closeDatabase } from '../helpers/db.js';
import { adminToken, userToken } from '../helpers/auth.js';

async function createCategory(token, data = {}) {
  return request(app)
    .post('/api/categories')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Categoria Padrão',
      ...data,
    });
}

function extractList(body) {
  return (
    body?.data ||
    body?.categories ||
    body?.items ||
    body ||
    []
  );
}

describe('Categories — CRUD', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('deve criar uma categoria como admin e retornar 201', async () => {
    const res = await createCategory(adminToken(), {
      name: 'Ficção',
    });

    expect(res.status).toBe(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.anything(),
        name: 'Ficção',
      })
    );
  });

  it('deve retornar 400 quando name está ausente', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('deve retornar 403 ao criar categoria como user', async () => {
    const res = await createCategory(userToken(), {
      name: 'Proibido',
    });

    expect(res.status).toBe(403);
  });

  it('deve listar categorias com paginação', async () => {
    await createCategory(adminToken(), { name: 'Cat 1' });
    await createCategory(adminToken(), { name: 'Cat 2' });

    const res = await request(app)
      .get('/api/categories?page=1&limit=10')
      .set('Authorization', `Bearer ${userToken()}`);

    expect(res.status).toBe(200);

    const list = extractList(res.body);

    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(2);
  });

  it('deve retornar 404 ao buscar categoria inexistente', async () => {
    const res = await request(app)
      .get('/api/categories/999999')
      .set('Authorization', `Bearer ${userToken()}`);

    expect(res.status).toBe(404);
  });

  it('deve atualizar categoria como admin', async () => {
    const created = await createCategory(adminToken(), {
      name: 'Antigo',
    });

    expect(created.status).toBe(201);

    const id = created.body.id;

    const res = await request(app)
      .put(`/api/categories/${id}`)
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ name: 'Novo' });

    // aceita qualquer padrão de API real
    expect([200, 204]).toContain(res.status);

    const body = res.body || {};

    if (body.name) {
      expect(body.name).toBe('Novo');
    }
  });

  it('deve deletar categoria como admin e retornar 204', async () => {
    const created = await createCategory(adminToken(), {
      name: 'Deletar',
    });

    expect(created.status).toBe(201);

    const id = created.body.id;

    const res = await request(app)
      .delete(`/api/categories/${id}`)
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(204);
  });
});