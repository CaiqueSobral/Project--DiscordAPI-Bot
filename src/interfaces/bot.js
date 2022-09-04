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

      const embed = {
        color: '#53b05a',
        description: `<@${member.user.id}> entrou no servidor!`,
        iconURL: member.user.displayAvatarURL(),
        thumbnail: member.user.displayAvatarURL(),
        author: 'Novo membro!',
        footer: member.user.id,
        fieldValue: this.#helpers.calcUserAge(member.user.createdAt),
        fieldName: `Idade da conta:`,
      };

      channel.send({
        embeds: [this.#helpers.embedBuilder('MemberAddRemove', embed)],
      });

      try {
        const role = member.guild.roles.cache.find(
          (role) => role.name === 'ESTAGS'
        );
        member.roles.add(role);

        const roleEmbed = {
          color: '#0270d1',
          description:
            '**<@' + member.user.id + '> recebeu o cargo `' + role.name + '`**',
          iconURL: member.user.displayAvatarURL(),
          author: member.user.tag,
          footer: member.user.id,
        };

        channel.send({
          embeds: [this.#helpers.embedBuilder('feed', roleEmbed)],
        });
      } catch (error) {
        console.log(error);
      }
    });

    this.#client.on('guildMemberRemove', (member) => {
      const channel = this.#helpers.checkChanel('feed', member.guild);
      if (!channel) return;

      const embed = {
        color: '#d13e04',
        description: `<@${member.user.id}> saiu do servidor!`,
        iconURL: member.user.displayAvatarURL(),
        thumbnail: member.user.displayAvatarURL(),
        author: 'Membro saiu!',
        footer: member.user.id,
        fieldValue: member.roles.cache.map((role) => role.name).join(', '),
        fieldName: `Roles:`,
      };

      channel.send({
        embeds: [this.#helpers.embedBuilder('MemberAddRemove', embed)],
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

      const embed = {
        color: color,
        author: newState.member.user.tag,
        iconURL: newState.member.user.displayAvatarURL(),
        description: message,
        footer: newState.member.user.id,
      };

      channel.send({
        embeds: [this.#helpers.embedBuilder('feed', embed)],
      });
    });
  }

  #userMessageHandler(message, userInput) {
    if (message.author.bot) return;

    const animal = this.#helpers.userInputAnimalCheck(userInput);
    if (animal) {
      this.#getPhoto(animal).then((photo) => {
        const embed = {
          color: '#0270d1',
          input: animal,
          imageUrl: photo,
        };
        message.channel.send({
          embeds: [this.#helpers.embedBuilder('animal', embed)],
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
    const result = await mongo.cariCount();
    const description = '' + process.env.CARIOCA_MESSAGE;
    const fieldValue = '' + process.env.CARIOCA_MESSAGE2;
    const imageURL = await mongo.cariUrls();
    const embed = {
      color: '#0270d1',
      author: message.author.tag,
      iconURL: message.author.displayAvatarURL(),
      thumbnail: imageURL,
      description: `**${description}**`,
      fieldName: fieldValue,
      fieldValue: `**${result.count + 1}**`,
      footer: message.author.id,
    };

    channel.send({
      embeds: [this.#helpers.embedBuilder('carioca', embed)],
    });

    mongo.disconnect();
  }

  async #getPhoto(userInput) {
    const photo = await this.#helpers.getPhoto(userInput);
    return photo;
  }
}
