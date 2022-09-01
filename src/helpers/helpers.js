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

  userInputAnimalCheck(userInput) {
    if (this.#catInputs.includes(userInput)) return 'cat';
    if (this.#dogInputs.includes(userInput)) return 'dog';
    if (this.#animalInputs.includes(userInput)) return userInput;
    return false;
  }
}
