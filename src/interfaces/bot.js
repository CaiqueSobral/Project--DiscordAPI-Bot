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
      this.#bits.GuildPresences,
      this.#bits.GuildMembers,
    ];
    this.#client = new Discord.Client({
      intents: this.#options,
      partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
    });
    this.#helpers = new Helpers();

    this.#start();
  }

  #start() {
    this.#client.login(this.#token);

    this.#client.on('ready', (client) => {
      console.log(`The bot ${client.user.tag} is now online!`);
    });

    this.#client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      const userInput = message.content.toLowerCase();

      this.#userMessageHandler(message, userInput);
    });

    this.#client.on('guildMemberAdd', (member) => {
      const channel = this.#helpers.checkFeedChanel(member.guild);
      if (!channel) return;

      channel.send({
        embeds: [
          this.#helpers.embedFeedBuiler(
            member,
            '#2ebd2a',
            `<@${member.user.id}> entrou no servidor!`,
            'Novo membro!',
            'Idade da conta:',
            this.#helpers.calcUserAge(member.user.createdAt)
          ),
        ],
      });
    });

    this.#client.on('guildMemberRemove', (member) => {
      const channel = this.#helpers.checkFeedChanel(member.guild);
      if (!channel) return;

      channel.send({
        embeds: [
          this.#helpers.embedFeedBuiler(
            member,
            '#d32e2e',
            `<@${member.user.id}> saiu da guilda!`,
            'Membro saiu!',
            'Roles:',
            member.roles.cache.map((role) => role.name).join(', ')
          ),
        ],
      });
    });
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
