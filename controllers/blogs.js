const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({});

  return response.json(allBlogs);
});

blogRouter.get('/:id', async (request, response) => {
  try {
    const blogToGet = await Blog
      .findById(request.params.id);

    return response.json(blogToGet);
  } catch (exception) {
    return response.status(400).json(exception);
  }
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

blogRouter.put('/:id', async (request, response) => {
  const update = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  try {
    const res = await Blog
      .findOneAndUpdate({ _id: request.params.id }, update, {
        new: true,
        runValidators: true,
        context: 'query',
      })
      .then((updatedBlog) => {
        response.json(updatedBlog);
      });

    return res;
  } catch (exception) {
    return response.status(400).json(exception);
  }
});

blogRouter.delete('/:id', async (request, response) => {
  try {
    const res = await Blog
      .findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end();
      });

    return res;
  } catch (exception) {
    return response.status(400).json(exception);
  }
});

module.exports = blogRouter;
