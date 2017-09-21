/* @flow */
'use strict'

import mongoose from 'mongoose'
import logger from 'winston'
import readLine from 'readline'
import dotenv from 'dotenv'

import { List } from 'immutable'

import userModel from './mongoose/UserModel'
import courseModel from './mongoose/CourseModel'
import avatarModel from './mongoose/AvatarModel'

import type {
  CollectionName,
  CollectionData,
  CollectionDataType
} from '../types'

dotenv.config()

const CONNECTION_POOL = {}

let connectionString = process.env['MONGO_USER'] && process.env['MONGO_PASSWORD']
? `mongodb://${process.env['MONGO_USER']}:${process.env['MONGO_PASSWORD']}@${process.env['MONGO_HOST'] || 'localhost'}/lexis`
: `mongodb://${process.env['MONGO_HOST'] || 'localhost'}/lexis`

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
  ): Promise<List<CollectionData>> {
    // await this.ensureConnected()

    if (typeof query === 'string') query = {_id: query}

    const collection = this.collection(collectionName)

    return new Promise((resolve, reject) => {
      collection.find(query, (err: Error, result: Array<CollectionDataType>) => {
        if (err) {
          reject(err)
        }

        resolve(List(result).map((p) => wrapResult(p, collectionName)))
      })
    })
  }

  async insert (
    data: CollectionData,
    collectionName: CollectionName
  ): Promise<CollectionData> {
    // await this.ensureConnected()

    const collection = await this.collection(collectionName)

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

  async pushToArray (
    query: any,
    data: any,
    arrayFieldName: string,
    collectionName: CollectionName
  ): Promise<boolean> {
    await this.ensureConnected()

    const collection = this.collection(collectionName)

    let result = await new Promise((resolve, reject) => {

      collection.find(query, async (err, result) => {
        let saveOps = List()
        if (err) reject(err)

        result.forEach((p) => {
          p[arrayFieldName].push(data)

          // adding promises for all the save operations
          p.save((error, r) => {
            saveOps = saveOps.push(new Promise((resolve, reject) => {
              if (error) {
                reject(error)
              }

              resolve(true)
            }))
          })
        })

        let results = await Promise.all(saveOps)

        if (results.filter((s) => s)) {
          resolve(true)
        }

        resolve(false)
      })
    })

    return result
  }

  async removeFromArray (
    query: any,
    data: any,
    arrayFieldName: string,
    collectionName: CollectionName
  ): Promise<boolean> {
    const collection = this.collection(collectionName)

    let result = await new Promise((resolve, reject) => {
      collection.find(query, async (err, result) => {
        let saveOps = List()

        result.forEach((p) => {
          let indexToRemove = p[arrayFieldName].indexOf(data)
          if (indexToRemove > -1) {
            p[arrayFieldName].splice(indexToRemove, 1)
          }

          // adding promises for all the save operations
          p.save((error, r) => {
            saveOps = saveOps.push(new Promise((resolve, reject) => {
              if (error) {
                reject(error)
              }
              resolve(true)
            }))
          })
        })

        let results = await Promise.all(saveOps)

        if (results.filter((s) => s)) {
          resolve(true)
        }

        resolve(false)
      })
    })

    return result
  }

  async update (
    query: any,
    data: any,
    collectionName: CollectionName
  ): Promise<any> {
    // await this.ensureConnected()

    const collection = this.collection(collectionName)

    let result = await new Promise((resolve, reject) => {
      collection.update(query, {$set: data}, (err: Error, result: any) => {
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
    // await this.ensureConnected()

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
    // await this.ensureConnected()

    return this.collection(collectionName).find(query).count()
  }

  collection (collectionName: CollectionName) {
    switch (collectionName) {
      case 'User':
        return userModel

      case 'Course':
        return courseModel

      case 'Avatar':
        return avatarModel

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
    const collection = this.collection(collectionName)

    collection.collection.drop()
  }

  async ensureConnected () {
    if (!this.db) await this.connect()
  }
}
// create MongoDB instance only one time and keep reference to it
const db = new MongoDatabase(encodeURI(connectionString))

export function getDbInstance (): MongoDatabase {
  return db
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

    case 'Avatar':
      return {
        type: 'avatar',
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
