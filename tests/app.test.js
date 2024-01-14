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

// describe('get handler tests', () => {
//   test('get should return the correct number of blog posts', async () => {
//     const response = await api.get('/api/blogs');
//     expect(response.body)
//       .toHaveLength(initialBlogs.listWithManyBlogs.length);
//   });

//   test('get should return json', async () => {
//     await api
//       .get('/api/blogs')
//       .expect(200)
//       .expect('Content-Type', /application\/json/);
//   });

//   test('get should return blogs with \'id\' instead of \'_id\' as the identifier', async () => {
//     const response = await api.get('/api/blogs');
//     expect(response.body[0].id)
//       .toBeDefined();
//   });
// });

// describe('push handler tests', () => {
//   test('number of items in the list should be one greater after adding a blog', async () => {
//     const newBlog = {
//       title: 'test blog title',
//       author: 'test author',
//       url: 'testblog.test',
//       likes: 5,
//     };

//     await api.post('/api/blogs').send(newBlog).expect(201);

//     const response = await api.get('/api/blogs');
//     expect(response.body)
//       .toHaveLength(initialBlogs.listWithManyBlogs.length + 1);

//     expect(response.body[response.body.length - 1].url)
//       .toContain('testblog.test');
//   });

//   test('new blogs with no likes value should default to 0 likes', async () => {
//     const newBlog = {
//       title: 'test blog title',
//       author: 'test author',
//       url: 'testblog.test',
//     };

//     await api.post('/api/blogs').send(newBlog).expect(201);

//     const response = await api.get('/api/blogs');

//     expect(response.body[response.body.length - 1].likes)
//       .toEqual(0);
//   });

//   test('new blogs without a title field should not be accepted and should result in error ode 400', async () => {
//     const newBlog = {
//       author: 'test author',
//       url: 'testblog.test',
//     };

//     await api.post('/api/blogs').send(newBlog).expect(400);
//   }, 10000);

//   test('new blogs with an empty title field should not be accepted and should result in error ode 400', async () => {
//     const newBlog = {
//       title: '',
//       author: 'test author',
//       url: 'testblog.test',
//     };

//     await api.post('/api/blogs').send(newBlog).expect(400);
//   }, 10000);

//   test('new blogs without a url field should not be accepted and should result in error ode 400', async () => {
//     const newBlog = {
//       title: 'test blog title',
//       author: 'test author',
//     };

//     await api.post('/api/blogs').send(newBlog).expect(400);
//   }, 10000);

//   test('new blogs with an empty url field should not be accepted and should result in error ode 400', async () => {
//     const newBlog = {
//       title: 'test blog title',
//       author: 'test author',
//       url: '',
//     };

//     await api.post('/api/blogs').send(newBlog).expect(400);
//   }, 10000);
// });

describe('put handler tests', () => {
  test('id should be the same, but content updated, for updated blog', async () => {
    const blogs = await api.get('/api/blogs');
    const indexOfBlogToUpdate = Math.floor(Math.random(initialBlogs.listWithManyBlogs.length) * 10);

    const newTitle = 'updated title';
    const newAuthor = 'updated author';
    const newURL = 'updated url';
    const newLikes = 1;

    const updatedBlog = { ...initialBlogs.listWithManyBlogs[indexOfBlogToUpdate] };
    updatedBlog.title = newTitle;
    updatedBlog.author = newAuthor;
    updatedBlog.url = newURL;
    updatedBlog.likes = newLikes;

    const res = await api
      .put(`/api/blogs/${blogs._body[indexOfBlogToUpdate].id}`)
      .send(updatedBlog)
      .expect(200);

    expect(res._body.title).toEqual(newTitle);
    expect(res._body.author).toEqual(newAuthor);
    expect(res._body.url).toEqual(newURL);
    expect(res._body.likes).toEqual(newLikes);

    const remBlogs = api
      .get('/api/blogs');

    const blogThatShouldHaveBeenReplaced = initialBlogs.listWithManyBlogs[indexOfBlogToUpdate];
    if (newTitle !== blogThatShouldHaveBeenReplaced.title) {
      expect(remBlogs).not.toContain(blogThatShouldHaveBeenReplaced.title);
    }
    if (newAuthor !== blogThatShouldHaveBeenReplaced.author) {
      expect(remBlogs).not.toContain(blogThatShouldHaveBeenReplaced.author);
    }
    if (newURL !== blogThatShouldHaveBeenReplaced.url) {
      expect(remBlogs).not.toContain(blogThatShouldHaveBeenReplaced.url);
    }
    if (newLikes !== blogThatShouldHaveBeenReplaced.likes) {
      expect(remBlogs).not.toContain(blogThatShouldHaveBeenReplaced.likes);
    }
  });
});

test('number of items in the list should be one greater after adding a blog', async () => {
  const blogs = await api
    .get('/api/blogs');
  const indexOfBlogToDelete = Math
    .floor(Math.random(initialBlogs.listWithManyBlogs.length) * 10);
  const blogToDelete = { ...blogs._body[indexOfBlogToDelete] };

  await api
    .delete(`/api/blogs/${blogs._body[indexOfBlogToDelete].id}`)
    .expect(204);

  const remBlogs = await api
    .get('/api/blogs');

  expect(remBlogs.body).toHaveLength(
    initialBlogs.listWithManyBlogs.length - 1,
  );

  const titles = remBlogs.body.map((b) => b.title);

  expect(titles).not.toContain(blogToDelete.title);
});

afterAll(async () => {
  await mongoose.connection.close();
});
