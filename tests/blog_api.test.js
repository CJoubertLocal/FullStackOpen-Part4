const {
  test, beforeEach, describe, after,
} = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const initialBlogs = require('./testData');

const Blog = require('../models/blogs');

const api = supertest(app);

const getRandomBlogPostFromDB = async () => {
  const existingBlogs = await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const randPosition = Math.floor(Math.random() * existingBlogs.body.length - 1);
  return existingBlogs.body[randPosition];
};

describe('tests with an initial list of many blogs', () => {
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

  test('post to /api/blogs should default to 0 likes if no "likes" value was provided', async () => {
    const newBlog = {
      title: 'A New Test Blog',
      author: 'Some guy',
      url: 'http://www.a-test-url.org/a-blog',
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

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < updatedBlogsList.body.length; i++) {
      if (
        newBlog.title === updatedBlogsList.body[i].title
        && newBlog.author === updatedBlogsList.body[i].author
        && newBlog.url === updatedBlogsList.body[i].url
      ) {
        assert.strictEqual(updatedBlogsList.body[i].likes, 0);
      }
    }
  });

  test('post requests to /api/blogs with no title should be rejected', async () => {
    const newBlog = {
      author: 'Some guy',
      url: 'http://www.a-test-url.org/a-blog',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('post requests to /api/blogs with no url should be rejected', async () => {
    const newBlog = {
      title: 'A New Test Blog',
      author: 'Some guy',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  describe('tests for viewing a specific blog', () => {
    test('getting with the id of an existing blog should return the correct blog', async () => {
      const particularBlogToGet = await getRandomBlogPostFromDB();

      const randomBlogExists = await api
        .get('/api/blogs/'.concat(particularBlogToGet.id))
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(particularBlogToGet, randomBlogExists.body);
    });

    /*
    Assumes that 'DoesNotExist' will always be an invalid ID.
    TODO: Checks for 'null' here due to that being the default return
    value for mongoose, but it would be preferable to catch nulls earlier on.
    */
    test('getting with an id which does not exist should return null', async () => {
      const res = await api
        .get('/api/blogs/DoesNotExist')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(res.body, null);
    });
  });

  describe('it should be possible to update the details of a blog post', () => {
    test('update all fields of a blog post based on its ID value', async () => {
      const particularBlogToGet = await getRandomBlogPostFromDB();

      const updatedBlogPost = {
        title: 'updated test title',
        author: 'updated test author',
        url: 'https://www.an-updated-test-url.com',
        likes: 0,
      };

      await api
        .put('/api/blogs/'.concat(particularBlogToGet.id))
        .send(updatedBlogPost)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      const updatedBlogInDB = await api
        .get('/api/blogs/'.concat(particularBlogToGet.id))
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(updatedBlogPost.author, updatedBlogInDB.body.author);
      assert.strictEqual(updatedBlogPost.title, updatedBlogInDB.body.title);
      assert.strictEqual(updatedBlogPost.url, updatedBlogInDB.body.url);
      assert.strictEqual(updatedBlogPost.likes, updatedBlogInDB.body.likes);
    });
  });

  describe('it should be possible to delete a blog post', async () => {
    test('it should be possible to delete a blog post by its id value', async () => {
      const blogPostToDelete = await getRandomBlogPostFromDB();

      await api
        .delete('/api/blogs/'.concat(blogPostToDelete.id))
        .expect(204);

      const res = await api
        .get('/api/blogs/'.concat(blogPostToDelete.id))
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual((await res).body, null);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
