import { createApp } from './app.mjs';
import { env } from './config/env.mjs';
import { logger } from './utils/logger.mjs';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Jarvis online na porta ${env.PORT}`);
});