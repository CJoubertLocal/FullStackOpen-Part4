const config = require('./utils/config');
const log = require('./utils/logger');
const app = require('./app');

app.listen(config.PORT, () => {
  log.info(`Server running on port ${config.PORT}`);
});
