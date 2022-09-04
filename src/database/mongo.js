import { MongoClient, ObjectId } from 'mongodb';

export class Mongo {
  #client;

  constructor() {
    const url = process.env.MONGO_URL;
    this.#client = new MongoClient(url);

    this.connect();
  }

  async connect() {
    try {
      await this.#client.connect();
    } catch (error) {
      console.log(error);
    }
  }

  async disconnect() {
    await this.#client.close();
  }

  async insertManyInfo(data) {
    try {
      const collection = this.#client.db('cbtroll').collection('carioca');
      await collection.updateOne(
        { _id: ObjectId('6312521a87fa6500bea45d31') },
        { $set: { urls: data } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async cariCount() {
    try {
      const collection = this.#client.db('cbtroll').collection('carioca');
      const result = await collection.findOne({
        _id: ObjectId('6312521a87fa6500bea45d31'),
      });

      await collection.updateOne(
        { _id: ObjectId('6312521a87fa6500bea45d31') },
        { $set: { count: result.count + 1 } }
      );

      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
