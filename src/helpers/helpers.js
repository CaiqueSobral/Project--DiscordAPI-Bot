import fetch from 'node-fetch';
import { EmbedBuilder } from 'discord.js';

export class Helpers {
  async getPhoto(userInput) {
    const response = await fetch(
      `https://source.unsplash.com/random/?${userInput}`
    );

    return response.url;
  }

  embedBuilder(input, imageUrl) {
    const embed = new EmbedBuilder()
      .setColor('#2274c7')
      .setTitle(`Um ${input} selvagem apareceu!`)
      .setImage(imageUrl);

    return embed;
  }

  userInputAnimalCheck(userInput) {}
}
