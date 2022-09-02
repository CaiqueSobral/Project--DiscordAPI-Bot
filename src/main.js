import { Bot } from './interfaces/bot.js';
import http from 'http';

const nodeApp = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is online!');
});

const port = process.env.PORT || 3000;
nodeApp.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  const bot = new Bot();
});
