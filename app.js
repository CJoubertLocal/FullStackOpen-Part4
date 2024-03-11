const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const config = require('./utils/config');

require('express-async-errors');

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

const BlogRouter = require('./controllers/blogs');
const UserRouter = require('./controllers/users');

app.use('/api/blogs', BlogRouter);
app.use('/api/users', UserRouter);

module.exports = app;
