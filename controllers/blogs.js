const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({});

  response.json(allBlogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  if (!Object.prototype.hasOwnProperty.call(blog, 'likes')) {
    blog.likes = 0;
  }

  const res = await blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    });

  return res;
});

module.exports = blogRouter;
