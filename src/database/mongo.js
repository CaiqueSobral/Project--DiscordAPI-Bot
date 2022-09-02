import { MongoClient } from 'mongodb';

export class Mongo {
  #db;
  #client;

  constructor() {
    const url = process.env.MONGO_URL;
    this.#client = new MongoClient(url);
  }

  async connect() {
    try {
      await this.#client.connect();
      this.#db = this.#client.db('cbtroll');
    } catch (error) {
      console.log(error);
    }
  }

  async disconnect() {
    await this.#client.close();
  }

  async getOne(collection, filter) {
    const result = await collection.findOne({ [filter]: { $exists: true } });
    return result;
  }

  async getCollection(collection) {
    return this.#db.collection(collection);
  }

  async updateOne(collection, filter, data) {
    const col = await this.getCollection(collection);
    return col.updateOne(filter, data);
  }
}
