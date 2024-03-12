/*
  Run npm test --test-concurrency=1 to avoid race conditions when testing.
*/
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

const checkIfUserInList = (userJson, listOfUsersFromDB) => {
  let userInDB = false;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < listOfUsersFromDB.body.length; i++) {
    if (
      listOfUsersFromDB.body[i].name === userJson.name
      && listOfUsersFromDB.body[i].username === userJson.username
    ) {
      userInDB = true;
    }
  }

  return userInDB;
};

describe('user tests with two users', () => {
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

    let usernameAndNameCombinationExists = false;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < response.body.length; i++) {
      if (
        response.body[i].username === initialUsers.oneUser[0].username
        && response.body[i].name === initialUsers.oneUser[0].name
      ) {
        usernameAndNameCombinationExists = true;
      }
    }

    assert(usernameAndNameCombinationExists);
  });

  describe('it should be possible to create new users', () => {
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

      assert(checkIfUserInList(newUser, allUsers));
    });

    test('it should not be possible to create a user with the same username as an existing user', async () => {
      const currentUsers = await getAllUsersInDB();

      const randomPositionInList = Math.floor(Math.random() * (currentUsers.body.length - 1));
      const randomUser = currentUsers.body[randomPositionInList];
      const jsonToSend = {
        username: randomUser.username,
        name: randomUser.name,
        password: 'somePassword',
      };

      const res = await api
        .post('/api/users/')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(jsonToSend)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersInDB = await getAllUsersInDB();

      assert(res.body.error.includes('expected `username` to be unique'));

      assert.strictEqual(usersInDB.length, currentUsers.length);
    });

    test('it should not be possible to create a user with a username shorter than 3 characters', async () => {
      const usersInDBAtStart = await getAllUsersInDB();

      const jsonToSend = {
        username: 'ab',
        name: 'some name',
        password: 'somePassword',
      };

      await api
        .post('/api/users/')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(jsonToSend)
        .expect(400);

      const usersInDBAtEnd = await getAllUsersInDB();

      assert.strictEqual(usersInDBAtStart.body.length, usersInDBAtEnd.body.length);

      assert(!checkIfUserInList(jsonToSend, usersInDBAtEnd));
    });

    test('it should not be possible to create a user with a password shorter than 3 characters', async () => {
      const usersInDBAtStart = await getAllUsersInDB();

      const jsonToSend = {
        username: 'someUserName',
        name: 'some name',
        password: 'sp',
      };

      await api
        .post('/api/users/')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(jsonToSend)
        .expect(400);

      const usersInDBAtEnd = await getAllUsersInDB();

      assert.strictEqual(usersInDBAtStart.body.length, usersInDBAtEnd.body.length);

      assert(!checkIfUserInList(jsonToSend, usersInDBAtEnd));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
