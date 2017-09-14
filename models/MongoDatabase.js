const Database = require('./Database');
// const mongodb = require('mongodb');
const mongoose = require('mongoose')
const logger = require('winston');

const userModel = require('./UserModel')

const CONNECTION_POOL = {};

class MongoDatabase extends Database {

  constructor(url){
    super(url, mongoose);
  }

  async select(query, collectionName){
    await super.ensureConnected(collectionName);

    if(typeof query === 'string') query = {_id: query};

    const collection = this.collection(collectionName);

    return await new Promise((res, rej) => {
        // console.log(collectionName)
        collection.find(query, (err, result) => {
          if (err) {
            rej(err)
          }

          res(result)
        })
    })
  }

  async insert(data, collectionName){
    await super.ensureConnected(collectionName);

    const collection = await this.collection(collectionName);
    let result;
    if(data instanceof Array){
      result = await new Promise((res, rej) => {
        collection.create(data, (err, results) => {
          if (err) {
            rej(err)
          }

          res(results)
        })
      })
    } else {
      result = await new Promise((res, rej) => {
        collection.create(data, (err, result) => {
          if (err) {
            rej(err)
          }

          res(result)
        })
      })
    }

    logger.info(`Inserted ${result.insertedCount} records into collection ${collectionName}`);
    return result;
  }

  async update(query, data, collectionName) {
    await super.ensureConnected(collectionName);

    const collection = this.collection(collectionName);

    let result = await new Promise((res, rej) => {
      collection.update(query, {$set: data}, (err, result) => {
        if (err) {
          rej(err)
        }

        res(result)
      })
    })

    logger.info(`Updated ${result.modifiedCount} objects in collection ${collectionName}`);
    return result;
  }

  async delete(query, collectionName){
    await super.ensureConnected(collectionName);

    const collection = this.collection(collectionName);
    let result = await new Promise((res, rej) => {
      collection.remove(query, (err, result) => {
        if (err) {
          rej(err)
        }

        res(result)
      })
    })
    logger.info(`Deleted ${result.deletedCount} objects in collection ${collectionName}`);
    console.log(result)

    return result
  }

  async count(query, collectionName) {
    await super.ensureConnected(collectionName);

    return await this.collection(collectionName).find(query).count();
  }

  collection(collectionName){
    switch (collectionName) {
      case 'User':
        return userModel

      default:
        throw new Error('The collection with the given name does not exist.')
    }
    // return this.db.collection(collectionName);
  }

  async connect(collectionName){
    if(CONNECTION_POOL[this.url]) this.db = CONNECTION_POOL[this.url];
    else {
      mongoose.connect(this.url);
      CONNECTION_POOL[this.url] = this.db;
      logger.info(`Opened database connection ${this.url}`);
    }
    if(collectionName){
      //if collection doesn't exist, create it
      // await this.db.createCollection(collectionName);
    }
    return this;
  }

  async disconnect(callback = () => {}){
    if(this.db) await this.db.close(() => {
      console.log('Mongoose disconnected')
      callback()
    });
    delete CONNECTION_POOL[this.url];
    logger.ingo(`Closed db connection ${this.url}`);
    return this;
  }

  async dropCollection (collectionName) {
    mongoose.connection.db.dropCollection(collectionName)
  }
}

module.exports = MongoDatabase;
