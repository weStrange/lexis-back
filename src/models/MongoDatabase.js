/* @flow */
'use strict'

import mongoose from 'mongoose'
import logger from 'winston'
import readLine from 'readline'

import Database from './Database'
import userModel from './mongoose/UserModel'

import type {
  CollectionName,
  CollectionData,
  CollectionDataType
} from '../types'

const CONNECTION_POOL = {}

class MongoDatabase {
  db: any;
  url: string;

  constructor (url: string) {
    this.url = url

    if (process.platform === 'win32') {
      const rl = readLine.createInterface({input: process.stdin, output: process.stdout})
      rl.on('SIGINT', () => {
        process.emit('SIGINT')
      })
    }

    process.on(
      'SIGINT',
      () => this.disconnect(() => process.exit(0))
    )
    process.on(
      'SIGTERM',
      () => this.disconnect(() => process.exit(0))
    )
    process.once(
      'SIGUSR2',
      () => this.disconnect(() => process.kill(process.pid, 'SIGUSR2'))
    )
  }

  async select (
    query: any,
    collectionName: CollectionName
  ): Promise<Array<CollectionData>> {
    await this.ensureConnected(collectionName)

    if (typeof query === 'string') query = {_id: query}

    const collection = this.collection(collectionName)

    return new Promise((resolve, reject) => {
      collection.find(query, (err: Error, result: Array<CollectionDataType>) => {
        if (err) {
          reject(err)
        }

        resolve(result.map((p) => wrapResult(p, collectionName)))
      })
    })
  }

  async insert (
    data: CollectionData,
    collectionName: CollectionName
  ): Promise<CollectionData> {
    await this.ensureConnected(collectionName)

    const collection = await this.collection(collectionName)
          console.log('Here is the user', data)
    let result = await new Promise((resolve, reject) => {
      collection.create(data.payload, (err: Error, result: CollectionDataType) => {
        if (err) {
          reject(err)
        }

        resolve(wrapResult(result, collectionName))
      })
    })

    // logger.info(`Inserted ${result.insertedCount} records into collection ${collectionName}`)
    return result
  }

  async update (
    query: any,
    data: CollectionData,
    collectionName: CollectionName
  ): Promise<any> {
    await this.ensureConnected(collectionName)

    const collection = this.collection(collectionName)

    let result = await new Promise((resolve, reject) => {
      collection.update(query, {$set: data.payload}, (err: Error, result: any) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      })
    })

    logger.info(`Updated ${result.modifiedCount} objects in collection ${collectionName}`)
    return result
  }

  async delete (query: any, collectionName: CollectionName): Promise<any> {
    await this.ensureConnected(collectionName)

    const collection = this.collection(collectionName)
    let result = await new Promise((resolve, reject) => {
      collection.remove(query, (err: Error, result: any) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      })
    })
    logger.info(`Deleted ${result.deletedCount} objects in collection ${collectionName}`)

    return result
  }

  async count (query: any, collectionName: CollectionName): Promise<number> {
    await this.ensureConnected(collectionName)

    return this.collection(collectionName).find(query).count()
  }

  collection (collectionName: CollectionName) {
    switch (collectionName) {
      case 'User':
        return userModel

      // TODO: aff Course collection and all the other collections here

      default:
        throw new Error('The collection with the given name does not exist.')
    }
    // return this.db.collection(collectionName);
  }

  async connect () {
    if (CONNECTION_POOL[this.url]) this.db = CONNECTION_POOL[this.url]
    else {
      mongoose.connect(this.url)
      CONNECTION_POOL[this.url] = this.db
      logger.info(`Opened database connection ${this.url}`)
    }

    return this
  }

  async disconnect (callback: () => void = () => {}) {
    if (this.db) {
      await this.db.close(() => {
        console.log('Mongoose disconnected')
        callback()
      })
    }
    delete CONNECTION_POOL[this.url]
    logger.info(`Closed db connection ${this.url}`)
    return this
  }

  async dropCollection (collectionName: CollectionName) {
    mongoose.connection.db.dropCollection(collectionName)
  }

  async ensureConnected (tableName: string) {
    if (!this.db) await this.connect(tableName)
  }
}

function wrapResult (
  result: any,
  collectionName: string
): CollectionData {
  switch (collectionName) {
    case 'User':
      return {
        type: 'user',
        payload: result
      }

    case 'Course':
      return {
        type: 'course',
        payload: result
      }

    // default to user, perhaps a better default option is needed
    default:
      return {
        type: 'user',
        payload: result
      }
  }
}

module.exports = MongoDatabase
