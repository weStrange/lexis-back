const Database = require('./Database');
const mongodb = require('mongodb');
const logger = require('winston');

const CONNECTION_POOL = {};

class MongoDatabase extends Database {

  constructor(url){
    super(url, mongodb);
  }

  async select(query, collectionName){
    await super.ensureConnected(collectionName);

    if(typeof query === 'string') query = {_id: query};

    const collection = this.db.collection(collectionName);

    let cursor = collection.find(query);
    return cursor;
  }

  async insert(data, collectionName){
    await super.ensureConnected(collectionName);

    const collection = await this.db.collection(collectionName);
    let result;
    if(data instanceof Array){
      result = await collection.insertMany(data);
    } else {
      result = await collection.insertOne(data);
    }
    logger.info(`Inserted ${result.insertedCount} records into collection ${collectionName}`);
    return result;
  }

  async update(query, data, collectionName){
    await super.ensureConnected(collectionName);

    const collection = this.db.collection(collectionName);

    let result = await collection.updateMany(query, {$set: data});
    logger.info(`Updated ${result.modifiedCount} objects in collection ${collectionName}`);
    return result;
  }

  async delete(query, collectionName){
    await super.ensureConnected(collectionName);

    const collection = this.db.collection(collectionName);
    let result = await collection.deleteMany(query);
    logger.info(`Deleted ${result.deletedCount} objects in collection ${collectionName}`);

    return result;
  }

  async count(query, collectionName){
    await super.ensureConnected(collectionName);

    return await this.db.collection(collectionName).find(query).count();
  }

  collection(collectionName){
    return this.db.collection(collectionName);
  }

  async connect(collectionName){
    if(CONNECTION_POOL[this.url]) this.db = CONNECTION_POOL[this.url];
    else {
      this.db = await mongodb.MongoClient.connect(this.url);
      CONNECTION_POOL[this.url] = this.db;
      logger.info(`Opened database connection ${this.url}`);
    }
    if(collectionName){
      //if collection doesn't exist, create it
      await this.db.createCollection(collectionName);
    }
    return this;
  }

  async disconnect(){
    if(this.db) await this.db.close();
    delete CONNECTION_POOL[this.url];
    logger.ingo(`Closed db connection ${this.url}`);
    return this;
  }
}

module.exports = MongoDatabase;
