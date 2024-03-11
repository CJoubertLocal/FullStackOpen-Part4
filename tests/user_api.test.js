const { test, after } = require('node:test');
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
  expect(response.body)
    .toHaveLength(initialUsers.oneUser.length);
});

after(async () => {
  await mongoose.connection.close();
});
