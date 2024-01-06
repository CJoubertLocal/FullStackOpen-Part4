const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

const BlogRouter = require('./controllers/blogs');
app.use('/api/blogs', BlogRouter);

module.exports = app;