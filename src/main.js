import { Bot } from './interfaces/bot.js';
import express, { Router } from 'express';
import http from 'http';

const nodeApp = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is online!');
});

const routes = Router();
routes.get('/', (req, res) => res.send('API is running!'));

const app = express();
app.use('/api/v1', routes);

const port = process.env.PORT || 3000;
nodeApp.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  const bot = new Bot();
});
