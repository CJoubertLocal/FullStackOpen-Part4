const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({});

  response.json(allBlogs);
});

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    });
});

module.exports = blogRouter;
