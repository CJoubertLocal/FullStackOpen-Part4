const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const config = require('./utils/config');

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

const BlogRouter = require('./controllers/blogs');

app.use('/api/blogs', BlogRouter);

module.exports = app;
