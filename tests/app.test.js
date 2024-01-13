const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');

const initialBlogs = require('./testData');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blogs');

beforeEach(async () => {
  await Blog.deleteMany({});

  const initBlogs = initialBlogs
    .listWithManyBlogs
    .map((blog) => new Blog(blog));
  const promiseArray = initBlogs
    .map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('get handler tests', () => {
  test('get should return the correct number of blog posts', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body)
      .toHaveLength(initialBlogs.listWithManyBlogs.length);
  });

  test('get should return json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('get should return blogs with \'id\' instead of \'_id\' as the identifier', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id)
      .toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
