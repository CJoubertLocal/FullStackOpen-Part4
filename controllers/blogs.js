const blogRouter = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/users');

blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 });

  return response.json(allBlogs);
});

blogRouter.get('/:id', async (request, response) => {
  const blogToGet = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1, id: 1 });

  return response.status(200).json(blogToGet);
});

blogRouter.post('/', async (request, response) => {
  const reqBody = request.body;
  const users = await User.find({});
  const user = users[0];

  const blog = new Blog({
    title: reqBody.title,
    url: reqBody.url,
    author: reqBody.author,
    // eslint-disable-next-line no-underscore-dangle
    user: user._id,
  });

  try {
    const result = await blog.save();
    // eslint-disable-next-line no-underscore-dangle
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    return response.status(201).json(result);
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
