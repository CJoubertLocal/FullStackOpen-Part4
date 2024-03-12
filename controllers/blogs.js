const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({});

  return response.json(allBlogs);
});

blogRouter.get('/:id', async (request, response) => {
  const blogToGet = await Blog
    .findById(request.params.id);

  return response.status(200).json(blogToGet);
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

  const updatedBlog = await Blog
    .findOneAndUpdate({ _id: request.params.id }, update, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  response.json(updatedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog
    .findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;
