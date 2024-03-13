const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

require('express-async-errors');

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

const BlogRouter = require('./controllers/blogs');
const UserRouter = require('./controllers/users');
const LoginRouter = require('./controllers/login');

app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);

app.use('/api/blogs', BlogRouter);
app.use('/api/users', UserRouter);
app.use('/api/login', LoginRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
