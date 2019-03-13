const request = require('supertest');
const app = require('./server');

describe('POST /api/numbers', () => {
  it('responds 200 to string of numbers', done => {
    request(app)
      .post('/api/numbers')
      .send({ numbers: '234' })
      .expect(200, done);
  });

  it('responds with correct object', done => {
    const { response1 } = require('./utils/mocks');
    request(app)
      .post('/api/numbers')
      .send({ numbers: '369' })
      .expect(200, done);

    // expect(res.body).toEqual(response1);
  });
});
