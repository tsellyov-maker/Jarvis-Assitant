import express from 'express';
import { handleJarvisCommand } from './core/jarvis.service.mjs';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/audio', express.static('audio'));
  app.use(express.static('public'));

  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      service: 'jarvis',
      status: 'online'
    });
  });

  app.post('/jarvis', async (req, res) => {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Texto é obrigatório' });
      }

      const result = await handleJarvisCommand(text);

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro interno' });
    }
  });

  return app;
}