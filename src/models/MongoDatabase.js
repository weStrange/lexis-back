/* @flow */
'use strict'

import mongoose from 'mongoose'
import logger from 'winston'
import readLine from 'readline'
import dotenv from 'dotenv'

dotenv.config()

const CONNECTION_POOL = {}

let connectionString =
  process.env['MONGO_USER'] && process.env['MONGO_PASSWORD']
    ? `mongodb://${process.env['MONGO_USER']}:${process.env[
      'MONGO_PASSWORD'
    ]}@${process.env['MONGO_HOST'] || 'localhost'}/lexis`
    : `mongodb://${process.env['MONGO_HOST'] || 'localhost'}/lexis`

class MongoDatabase {
  db: any
  url: string

  constructor (url: string) {
    this.url = url

    if (process.platform === 'win32') {
      const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.on('SIGINT', () => {
        process.emit('SIGINT')
      })
    }

    process.on('SIGINT', () => this.disconnect(() => process.exit(0)))
    process.on('SIGTERM', () => this.disconnect(() => process.exit(0)))
    process.once('SIGUSR2', () =>
      this.disconnect(() => process.kill(process.pid, 'SIGUSR2'))
    )
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
        logger.error('Mongoose disconnected')
        callback()
      })
    }
    delete CONNECTION_POOL[this.url]
    logger.info(`Closed db connection ${this.url}`)
    return this
  }

  async ensureConnected () {
    if (!this.db) await this.connect()
  }
}
// create MongoDB instance only one time and keep reference to it
const database = new MongoDatabase(encodeURI(connectionString))
// make a connection
database.connect()

export default database
