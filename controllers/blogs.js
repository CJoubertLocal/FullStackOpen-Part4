const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({});

  response.json(allBlogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  try {
    const res = await blog
      .save()
      .then((result) => {
        response.status(201).json(result);
      });

    return res;
  } catch (exception) {
    return response.status(400).json(exception);
  }
});

module.exports = blogRouter;
