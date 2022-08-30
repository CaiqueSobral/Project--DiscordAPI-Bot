import Discord, { GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

export class Bot {
  #token;
  #bits;
  #options;
  #client;

  constructor() {
    this.#token = process.env.TOKEN;
    this.#bits = GatewayIntentBits;
    this.#options = [
      this.#bits.Guilds,
      this.#bits.GuildMessages,
      this.#bits.MessageContent,
      this.#bits.GuildMessageReactions,
    ];
    this.#client = new Discord.Client({
      intents: this.#options,
      partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
    });

    this.#start();
  }

  #start() {
    this.#client.on('ready', (client) => {
      console.log(`The bot ${client.user.tag} is now online!`);
    });

    this.#client.on('messageCreate', (message) => {
      if (message.author.bot) return;

      const userInput = message.content.toLowerCase().split(' ');

      if (user[0] === 'loot') {
        message.reply(
          `You have looted ${Math.floor(Math.random() * 1000)} gold!`
        );
      }
    });

    this.#client.login(this.#token);
  }
}
