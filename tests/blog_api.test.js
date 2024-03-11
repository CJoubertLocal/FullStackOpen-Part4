const { test, after } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const initialBlogs = require('./testData');

const Blog = require('../models/blogs');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const initBlogs = initialBlogs
    .listWithManyBlogs
    .map((blog) => new Blog(blog));
  const promiseArray = initBlogs
    .map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('get should return the correct number of blog posts', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body)
    .toHaveLength(initialBlogs.listWithManyBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
