const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/users');

usersRouter.get('/', async (request, response) => {
  const allUsers = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 });

  return response.json(allUsers);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3) {
    const e = new Error('password should be at least three characters long');
    e.name = 'ValidationError';
    throw e;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  return response.status(201).json(savedUser);
});

usersRouter.put('/:id', async (request, response) => {
  const update = {
    blogs: request.body.blogs,
  };

  const updatedUser = await User
    .findOneAndUpdate({ _id: request.params.id }, update, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  response.json(updatedUser);
});

module.exports = usersRouter;
