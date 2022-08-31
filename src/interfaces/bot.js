import Discord, { GatewayIntentBits } from 'discord.js';
import { PhotoService } from './unsplash.js';
import { Helpers } from './helpers.js';

export class Bot {
  #token;
  #bits;
  #options;
  #client;
  #helpers;

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
    this.#helpers = new Helpers();

    this.#start();
  }

  #start() {
    this.#client.on('ready', (client) => {
      console.log(`The bot ${client.user.tag} is now online!`);
    });

    this.#client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      const userInput = message.content.toLowerCase();

      this.#userMessageHandler(message, userInput);
    });

    this.#client.login(this.#token);
  }

  #userMessageHandler(message, userInput) {
    if (message.author.bot) return;

    if (userInput === 'cat' || userInput === 'dog') {
      this.#getPhoto(userInput).then((photo) => {
        message.channel.send(
          `Uma foto de um ${
            userInput === 'cat' ? 'gatinho' : 'cachorrinho'
          } para você!`
        );
        message.channel.send(photo);
      });
    }
  }

  async #getPhoto(userInput) {
    const photo = await this.#helpers.getPhoto(userInput);
    return photo;
  }
}
