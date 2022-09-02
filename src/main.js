import { Bot } from './interfaces/bot.js';
import http from 'http';

nodeApp.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 3000;
nodeApp.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

const bot = new Bot();
