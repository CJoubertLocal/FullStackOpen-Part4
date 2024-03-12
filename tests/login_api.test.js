const {
  test, beforeEach, describe, after,
} = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const User = require('../models/users');

const initialLoginDetails = require('./testLoginDataPass');
const initialUserDetails = require('./testUserData');

const api = supertest(app);

const getRandomLoginDetails = () => {
  const randomNumber = Math.floor(Math.random() * (initialLoginDetails.twoUsers.length - 1));
  return initialLoginDetails.twoUsers[randomNumber];
};

describe('login produce a json web token when credentials are valid', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const initUsers = initialUserDetails
      .twoUsers
      .map((user) => new User(user));

    const promiseArray = initUsers
      .map((user) => user.save());

    await Promise.all(promiseArray);
  });

  test('valid credentials should return a json web token', async () => {
    const randomLoginCredentials = getRandomLoginDetails();

    const res = await api
      .post('/api/login/')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(randomLoginCredentials)
      .expect(200);

    assert(res.body.token);
    assert.strictEqual(res.body.username, randomLoginCredentials.username);
  });

  test('invalid login names should not return a json web token', async () => {
    const randomLoginCredentials = getRandomLoginDetails();
    randomLoginCredentials.username = '_not-areal_username';

    const res = await api
      .post('/api/login/')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(randomLoginCredentials)
      .expect(401);

    assert.strictEqual(res.body.token, undefined);
    assert.strictEqual(res.body.error, 'invalid username or password');
  });

  test('invalid passwords should not return a json web token', async () => {
    const randomLoginCredentials = getRandomLoginDetails();
    randomLoginCredentials.password = '_not-areal_password';

    const res = await api
      .post('/api/login/')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(randomLoginCredentials)
      .expect(401);

    assert.strictEqual(res.body.token, undefined);
    assert.strictEqual(res.body.error, 'invalid username or password');
  });
});

after(async () => {
  await mongoose.connection.close();
});
