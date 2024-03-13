/*
  logger code and unknown endpoint code from:

  https://github.com/fullstack-hy2020/part3-notes-backend/blob/part4-8/utils/middleware.js
*/
const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const tokenExtractor = (request, response, next) => {
  let auth = request.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    auth = auth.replace('Bearer ', '');
    request.token = auth;
  }

  next();
};

const errorHandler = (error, request, response, next) => {
  console.log('errorhandler');
  console.error(error.message);
  console.log(error.name);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'ConcurrentUpdateError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    console.log('mongo db error');
    return response.status(400).json({ error: 'expected `username` to be unique' });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' });
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  errorHandler,
};
