/* @flow */
'use strict'

import crypto from 'crypto'
import logger from 'winston'
import mongodb from 'mongodb'

import MongoDatabase from './MongoDatabase'
// import Model from './Model'
import type { Gender, User as UserType } from '../types'

let connectionString = process.env['MONGO_USER'] && process.env['MONGO_PASSWORD']
? `mongodb://${process.env['MONGO_USER']}:${process.env['MONGO_PASSWORD']}@${process.env['MONGO_HOST'] || 'localhost'}/lexis`
: `mongodb://${process.env['MONGO_HOST'] || 'localhost'}/lexis`

const db = new MongoDatabase(encodeURI(connectionString))
console.log(process.env.MONGO_HOST)
const collectionName = 'User'

// TODO: create MongoModel class and extend it instead
type UserData = {
  email: string,
  firstName: string,
  lastName: string,
  birthday?: string,
  gender?: Gender
}

class User {
  _id: any;
  email: string;
  firstName: string;
  lastName: string;
  registrationDate: string;
  birthday: string;
  gender: string;

  constructor (data: UserType) {
    // super(data)

    this.email = data.email
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.registrationDate = data.registrationDate
    this.birthday = data.birthday
    this.gender = data.gender
  }

  // allow access to the raw mongodb driver's database instance, if it exists (ensureConnected called at least once)
  // this is like a getter for private static variable in Java
  static get DB () {
    return db
  }

  // collection name of the model
  static get COLLECTION () {
    return collectionName
  }

  // transform a standard query object into something compatible with this model's database - mongo
  static transformQuery (query) {
    if (query && query.id) {
      query._id = new mongodb.ObjectId(query.id)
      delete query.id
    }
    // if query is an array of strings, assume it's a set of IDs to search for
    if (query instanceof Array && query.every(v => typeof v === 'string')) query = { '_id': { '$in': query.map(q => new mongodb.ObjectId(q)) } }
    return query
  }

  static async count (query: any) {
    query = User.transformQuery(query)

    return User.DB.count(query, User.COLLECTION)
  }

  static async where (query: any): Promise<Array<User>> {
    // transform query for this model
    query = User.transformQuery(query)

    const results = await User.DB.select(query, User.COLLECTION)

    return results.map(p => new User(p))
  }

  static async find (query: any): Promise<Array<User>> {
    let results = await User.DB.select(query, User.COLLECTION)
    // results = await results.next();
    if (!results) return []

    return results.map(data => new User(data))
  }

  static async findOne (query: any): Promise<User | null> {
    let result = (await this.find(query))[0]

    if (result) {
      return result
    }

    return null
  }

  static async delete (query: any): Promise<number> {
    query = User.transformQuery(query)
    const result = await User.DB.delete(query, User.COLLECTION)
    return result.result.ok
  }

  static async update (query: any, data: UserType): Promise<number> {
    query = User.transformQuery(query)
    const result = await User.DB.update(query, data, User.COLLECTION)

    return result.ok
  }

  static async insert (data: UserType): Promise<User> {
    const result = await User.DB.insert(data, User.COLLECTION)
    return new User(result)
  }

  serialize (withId: boolean = true): UserType {
    return {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      registrationDate: this.registrationDate,
      birthday: this.birthday,
      gender: this.gender
    }
  }
/*
  async save (): Promise<User> {
    let data = this.serialize()

    if (this._id) {
      // you could also do things like new mongodb.ObjectId(this.id) here if you want to be 100% compliant
      return User.DB.update({ _id: this._id }, data, User.COLLECTION)
    } else {
      let user = await User.DB.insert(data, User.COLLECTION)

      this._id = user._id.toString()
    }
    return this
  }

  async delete (): Promise<User> {
    await User.DB.delete({ _id: this._id }, User.COLLECTION)
    // const results = await User.DB.delete({_id: {'$in': [new mongodb.ObjectId(this.id)]}}, User.COLLECTION);
    // do something with results, e.g. if CASCADE is not set, you might need to run through all associations and delete them all
    return this
  }
  */
}

function getHashAndSalt (
  password: string
): { salt: string, hash: string } {
  let salt = crypto.randomBytes(16).toString('hex')
  let hash = crypto.pbkdf2Sync(password, salt, 1000, 64)
    .toString('hex')

  return { salt, hash }
}

module.exports = User
