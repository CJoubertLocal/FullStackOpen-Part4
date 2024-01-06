require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(express.json());

const BlogRouter = require('./controllers/blogs');
app.use('/api/blogs', BlogRouter);

app.use(cors());
app.use(express.json());

const log = require('./utils/logger');
const PORT = process.env.PORT;
app.listen(PORT, () => {
  log.info(`Server running on port ${PORT}`);
});