const { PORT, MONGODB_URI } = require('./utils/config')
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');


mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(express.json());

const BlogRouter = require('./controllers/blogs');
app.use('/api/blogs', BlogRouter);

const log = require('./utils/logger');

app.listen(PORT, () => {
  log.info(`Server running on port ${PORT}`);
});