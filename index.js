const config = require('./utils/config');
const log = require('./utils/logger');
const app = require('./app');

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
    return response.status(400).json({ error: 'expected `username` to be unique' });
  }

  next(error);
};

app.use(errorHandler);

app.listen(config.PORT, () => {
  log.info(`Server running on port ${config.PORT}`);
});
