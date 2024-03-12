const {
  test, beforeEach, describe, after,
} = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const initialUsers = require('./testUserData');

const User = require('../models/users');

const api = supertest(app);

const getAllUsersInDB = async () => {
  const res = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  return res;
};

describe.only('user tests with two users', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const initUsers = initialUsers
      .twoUsers
      .map((user) => new User(user));

    const promiseArray = initUsers
      .map((user) => user.save());

    await Promise.all(promiseArray);
  });

  test('users are returned as json', async () => {
    await getAllUsersInDB();
  });

  test('get should return the correct number of users', async () => {
    const response = await api.get('/api/users');

    assert.strictEqual(response.body.length, initialUsers.twoUsers.length);
  });

  test('user in test database should have the correct username and name', async () => {
    const response = await api.get('/api/users');

    assert.strictEqual(response.body[0].username, initialUsers.oneUser[0].username);
    assert.strictEqual(response.body[0].name, initialUsers.oneUser[0].name);
  });

  describe.only('it should be possible to create new users', () => {
    test('creating one user should be possible', async () => {
      const newUser = {
        name: 'a new name',
        username: 'a new username',
        password: 'someNewPassword',
      };

      await api
        .post('/api/users/')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(newUser)
        .expect(201);

      const allUsers = await getAllUsersInDB();

      let userExists = false;

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < allUsers.body.length; i++) {
        if (
          allUsers.body[i].name === newUser.name
          && allUsers.body[i].username === newUser.username
        ) {
          userExists = true;
        }
      }

      assert(userExists);
    });

    test.only('it should not be possible to create a user with the same username as an existing user', async () => {
      const currentUsers = await getAllUsersInDB();

      const randomPositionInList = Math.floor(Math.random() * (currentUsers.body.length - 1));
      const randomUser = currentUsers.body[randomPositionInList];

      const res = await api
        .post('/api/users/')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(randomUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersInDB = await getAllUsersInDB();

      assert(res.body.error.includes('expected `username` to be unique'));

      assert.strictEqual(usersInDB.length, currentUsers.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
