import fetch from 'node-fetch';

export class Helpers {
  async getPhoto(userInput) {
    const response = await fetch(
      `https://source.unsplash.com/random/?${userInput}`
    );

    return response.url;
  }
}
