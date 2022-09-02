import Discord, { GatewayIntentBits } from 'discord.js';
import { Helpers } from '../helpers/helpers.js';
import { Mongo } from '../database/mongo.js';

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
      this.#bits.GuildVoiceStates,
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

      if (userInput === process.env.CARIOCA_COUNT) {
        this.#cariocaCount(message);
      }

      this.#userMessageHandler(message, userInput);
    });

    this.#client.on('guildMemberAdd', (member) => {
      const channel = this.#helpers.checkChanel('feed', member.guild);
      if (!channel) return;

      channel.send({
        embeds: [
          this.#helpers.embedFeedBuiler(
            member,
            '#53b05a',
            `<@${member.user.id}> entrou no servidor!`,
            'Novo membro!',
            'Idade da conta:',
            this.#helpers.calcUserAge(member.user.createdAt)
          ),
        ],
      });

      try {
        const role = member.guild.roles.cache.find(
          (role) => role.name === 'ESTAGS'
        );
        member.roles.add(role);

        channel.send({
          embeds: [
            this.#helpers.embedFeedBuiler(
              member,
              '#0270d1',
              null,
              `${member.user.tag}`,
              '**<@' +
                member.user.id +
                '> recebeu o cargo `' +
                role.name +
                '`**',
              null
            ),
          ],
        });
      } catch (error) {
        console.log(error);
      }
    });

    this.#client.on('guildMemberRemove', (member) => {
      const channel = this.#helpers.checkChanel('feed', member.guild);
      if (!channel) return;

      channel.send({
        embeds: [
          this.#helpers.embedFeedBuiler(
            member,
            '#d13e04',
            `<@${member.user.id}> saiu da guilda!`,
            'Membro saiu!',
            'Roles:',
            member.roles.cache.map((role) => role.name).join(', ')
          ),
        ],
      });
    });

    this.#client.on('voiceStateUpdate', (oldState, newState) => {
      if (oldState.channelId === newState.channelId) return;

      const channel = this.#helpers.checkChanel('feed', newState.guild);
      if (!channel) return;
      let message;
      let color;

      if (!oldState.channelId) {
        message =
          '**<@' +
          newState.member.id +
          '> entrou no canal `' +
          newState.channel.name +
          '`**';
        color = '#53b05a';
      }

      if (!newState.channelId) {
        message =
          '**<@' +
          oldState.member.id +
          '> saiu do canal `' +
          oldState.channel.name +
          '`**';
        color = '#d13e04';
      }

      if (oldState.channelId && newState.channelId) {
        message =
          '**<@' +
          newState.member.id +
          '> mudou de canal de `' +
          oldState.channel.name +
          '` para `' +
          newState.channel.name +
          '`**';
        color = '#0270d1';
      }

      channel.send({
        embeds: [
          this.#helpers.embedFeedBuiler(
            newState.member,
            color,
            null,
            `${newState.member.user.tag}`,
            message,
            null
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

  async #cariocaCount(message) {
    const channel = this.#helpers.checkChanel(
      process.env.CARIOCA_CHANNEL,
      message.guild
    );
    if (!channel) return;

    const mongo = new Mongo();
    await mongo.connect();
    const collection = await mongo.getCollection('carioca');

    let count = await mongo.getOne(collection, 'count');
    count.count++;

    console.log(count.count);

    mongo.disconnect();
  }

  async #getPhoto(userInput) {
    const photo = await this.#helpers.getPhoto(userInput);
    return photo;
  }
}
