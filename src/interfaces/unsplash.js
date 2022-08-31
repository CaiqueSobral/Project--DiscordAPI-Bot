import fetch from 'node-fetch';

export class PhotoService {
  //#accessKey;

  constructor() {
    //this.#accessKey = process.env.UNSPLASH_API;
  }

  async getPhoto(userInput) {
    const response = await fetch(
      //`https://api.unsplash.com/photos/random/?client_id=${this.#accessKey}`
      `https://source.unsplash.com/random/?${userInput}`
    );

    return response.url;
  }
}
