const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const initialUsers = require('./testUserData');

const User = require('../models/users');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const initUsers = initialUsers
    .oneUser
    .map((user) => new User(user));

  const promiseArray = initUsers
    .map((user) => user.save());

  await Promise.all(promiseArray);
});

test('users are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('get should return the correct number of users', async () => {
  const response = await api.get('/api/users');

  assert.strictEqual(response.body.length, initialUsers.oneUser.length);
});

test('user in test database should have the correct username and name', async () => {
  const response = await api.get('/api/users');

  assert.strictEqual(response.body[0].username, initialUsers.oneUser[0].username);
  assert.strictEqual(response.body[0].name, initialUsers.oneUser[0].name);
});

after(async () => {
  await mongoose.connection.close();
});
