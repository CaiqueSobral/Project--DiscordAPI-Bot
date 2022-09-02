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

  embedAnimalBuilder(input, imageUrl) {
    const embed = new EmbedBuilder()
      .setColor('#2274c7')
      .setTitle(
        `Um ${
          input === 'cat'
            ? 'gatinho'
            : input === 'dog'
            ? 'cachorrinho'
            : 'animalzinho'
        } selvagem apareceu!`
      )
      .setImage(imageUrl);

    return embed;
  }

  embedFeedBuiler(member, color, description, author, addFields, fieldValue) {
    let embed = new EmbedBuilder()
      .setColor(color)
      .setAuthor({
        name: author,
        iconURL: member.user.displayAvatarURL(),
      })
      .setFooter({
        text: member.user.id,
      })
      .setTimestamp();

    if (fieldValue) {
      embed
        .setFields([
          {
            name: addFields,
            value: fieldValue,
          },
        ])
        .setThumbnail(member.user.displayAvatarURL());
    }

    if (description) {
      embed.setDescription(description);
    } else {
      embed.setDescription(addFields);
    }

    return embed;
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
