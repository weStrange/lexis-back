/* @flow */
'use strict'

const readLine = require('readline')

class Database {
  url: string;
  driver: any;

  constructor (url: string, driver: any) {
    // console.log(url)
    this.url = url
    this.driver = driver

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

  async ensureConnected (tableName: string) {
    if (!this.db) await this.connect(tableName)
  }

  // return some kind of result set from the query object passed
  async select (query: any) {
    throw new Error('Database.select is abstract and must be implemented by subclasses')
  }

  // insert records using the query and return something
  async insert (query: any) {
    throw new Error('Database.insert is abstract and must be implemented by subclasses')
  }

  // update records using the query and return something
  async update (query: any) {
    throw new Error('Database.update is abstract and must be implemented by subclasses')
  }

  // delete records using the query and return something
  async delete (args: any) {
    throw new Error('Database.delete is abstract and must be implemented by subclasses')
  }

  async count (args: any) {
    throw new Error('Database.count is abstract and must be implemented by subclasses')
  }

  // set this.db to a database instance of the provided driver
  async connect () {
    throw new Error('Database.connect is abstract and must be implemented by subclasses')
  }

  // free up a connection using the provided driver
  async disconnect () {
    throw new Error('Database.disconnect is abstract and must be implemented by subclasses')
  }

  async beginTransaction () {
    throw new Error('Database.beginTransaction is abstract and must be implemented by subclasses')
  }

  async commitTransaction () {
    throw new Error('Database.commitTransaction is abstract and must be implemented by subclasses')
  }

  // get database instance
  getDb () {
    return this.db
  }
}

module.exports = Database
