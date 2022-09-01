import Discord, { GatewayIntentBits } from 'discord.js';
import { Helpers } from '../helpers/helpers.js';

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

    const animal = this.#helpers.userInputAnimalCheck(userInput);
    if (animal) {
      this.#getPhoto(animal).then((photo) => {
        message.channel.send({
          embeds: [this.#helpers.embedAnimalBuilder(animal, photo)],
        });
      });
    }
  }

  async #getPhoto(userInput) {
    const photo = await this.#helpers.getPhoto(userInput);
    return photo;
  }
}
