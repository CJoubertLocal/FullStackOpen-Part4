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

module.exports = {
  errorHandler,
};
