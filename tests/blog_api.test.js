const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');

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
  assert.strictEqual(response.body.length, initialBlogs.listWithManyBlogs.length);
});

test('blog api should replace _id with id for returned results', async () => {
  const response = await api.get('/api/blogs');
  assert(Object.keys(response.body[0]).includes('id'));
  assert(!Object.keys(response.body[0]).includes('_id'));
});

test('post to /api/blogs should create a new blog post', async () => {
  const newBlog = {
    title: 'A New Test Blog',
    author: 'Some guy',
    url: 'http://www.a-test-url.org/a-blog',
    likes: 2,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const updatedBlogsList = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(updatedBlogsList.body.length, initialBlogs.listWithManyBlogs.length + 1);

  let newBlogFound = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < updatedBlogsList.body.length; i++) {
    if (
      newBlog.title === updatedBlogsList.body[i].title
      && newBlog.author === updatedBlogsList.body[i].author
      && newBlog.url === updatedBlogsList.body[i].url
      && newBlog.likes === updatedBlogsList.body[i].likes
    ) {
      newBlogFound = true;
    }
  }

  assert(newBlogFound);
});

after(async () => {
  await mongoose.connection.close();
});
