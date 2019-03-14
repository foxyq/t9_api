const request = require('supertest');
const app = require('./server');
const { response1, response2 } = require('./utils/mocks');

describe('POST /api/numbers', () => {
  it('responds 200 to correct numbers object', done => {
    request(app)
      .post('/api/numbers')
      .send({ numbers: '234' })
      .expect(200, done);
  });

  it('responds with correct object1', async () => {
    const res = await request(app)
      .post('/api/numbers')
      .send({ numbers: response1.request });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(response1.body);
  });

  it('responds with correct object2', async () => {
    const res = await request(app)
      .post('/api/numbers')
      .send({ numbers: response2.request });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(response2.body);
  });

  it('responds 200 to correct numbers object', done => {
    request(app)
      .post('/api/numbers')
      .send({ numbers: '234' })
      .expect(200, done);
  });
});
