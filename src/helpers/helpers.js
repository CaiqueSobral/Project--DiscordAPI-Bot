import fetch from 'node-fetch';
import { EmbedBuilder } from 'discord.js';

export class Helpers {
  #catInputs = ['cat', 'gato', 'gatinho', 'psps', 'pspsps', 'gatin'];
  #dogInputs = ['dog', 'cachorro', 'cachorrinho', 'doguinho', 'cachorrin'];
  #animalInputs = ['snake', 'bird', 'rabbit', 'hamster', 'horse'];

  async getPhoto(userInput) {
    const response = await fetch(
      `https://source.unsplash.com/random/?${userInput}`
    );

    return response.url;
  }

  embedBuilder(type, builder) {
    let embed = new EmbedBuilder().setColor(builder.color);

    if (type === 'animal') {
      embed
        .setTitle(
          `Um ${
            builder.input === 'cat'
              ? 'gatinho'
              : builder.input === 'dog'
              ? 'cachorrinho'
              : 'animalzinho'
          } selvagem apareceu!`
        )
        .setImage(builder.imageUrl);

      return embed;
    }

    if (type === 'feed') {
      embed
        .setAuthor({
          name: builder.author,
          iconURL: builder.iconURL,
        })
        .setDescription(builder.description)
        .setFooter({
          text: builder.footer,
        })
        .setTimestamp();
      return embed;
    }

    if (type === 'MemberAddRemove') {
      embed
        .setAuthor({
          name: builder.author,
          iconURL: builder.iconURL,
        })
        .setThumbnail(builder.thumbnail)
        .setDescription(builder.description)
        .setFields([
          {
            name: builder.fieldName,
            value: builder.fieldValue,
          },
        ])
        .setFooter({
          text: builder.footer,
        })
        .setTimestamp();
      return embed;
    }

    if (type === 'carioca') {
      embed
        .setAuthor({
          name: builder.author,
          iconURL: builder.iconURL,
        })
        .setImage(builder.thumbnail)
        .setTitle(builder.description)
        .setFields([
          {
            name: builder.fieldName,
            value: builder.fieldValue,
          },
        ])
        .setFooter({
          text: builder.footer,
        })
        .setTimestamp();
      return embed;
    }
  }

  calcUserAge(createdAt) {
    const today = new Date();
    let userAge = today - createdAt;
    const months = Math.floor(userAge / 1000 / 60 / 60 / 24 / 30);
    const days = Math.floor(userAge / 1000 / 60 / 60 / 24 - months * 30);

    if (months === 0 && days === 0) return 'Menos de 1 dia';
    if (months === 0 && days > 0) return `${days} dia(s)`;
    if (months > 0 && days === 0) return `${months} mês(es)`;
    if (months > 0 && days > 0) return `${months} mês(es) e ${days} dia(s)`;
  }

  userInputAnimalCheck(userInput) {
    if (this.#catInputs.includes(userInput)) return 'cat';
    if (this.#dogInputs.includes(userInput)) return 'dog';
    if (this.#animalInputs.includes(userInput)) return userInput;
    return false;
  }

  checkChanel(channelName, guild) {
    const channel = guild.channels.cache.find((chanel) => {
      return chanel.name === channelName;
    });

    return channel;
  }
}
