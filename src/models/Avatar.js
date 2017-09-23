/* @flow */
'use strict'

import mongodb from 'mongodb'

// import { List } from 'immutable'

import { getDbInstance } from './MongoDatabase'
// import Utils from '../utils'
// import Model from './Model'
import type {
  Avatar as AvatarType,
  CollectionData
} from '../types'

const collectionName = 'Avatar'

export default class Avatar {
  _id: any
  email: string
  img: ?Buffer
  mimetype: ?string

  constructor (data: AvatarType) {
    // super(data)

    this.email = data.email
    this.img = data.img
    this.mimetype = data.mimetype
  }

  // allow access to the raw mongodb driver's database instance, if it exists (ensureConnected called at least once)
  // this is like a getter for private static variable in Java
  static getDb (): any {
    return getDbInstance()
  }

  // collection name of the model
  static getCollectionName (): string {
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

  static async count (query: any): Promise<number> {
    query = Avatar.transformQuery(query)

    return Avatar.getDb().count(query, Avatar.getCollectionName())
  }

  static async find (query: any): Promise<Array<Avatar>> {
    let results = await Avatar.getDb().select(query, Avatar.getCollectionName())
    // results = await results.next();
    if (!results) return []

    let filtered = []
    results
      .forEach((p) => {
        if (p.type === 'avatar') {
          filtered.push(p.payload)
        }
      })

    return filtered.map(data => new Avatar(data))
  }

  static async findOne (query: any): Promise<Avatar | null> {
    let result = (await this.find(query))[0]

    if (result) {
      return result
    }

    return null
  }

  static async delete (query: any): Promise<number> {
    query = Avatar.transformQuery(query)
    const result = await Avatar.getDb().delete(query, Avatar.getCollectionName())
    return result.result.ok
  }

  static async update (query: any, data: AvatarType): Promise<number> {
    query = Avatar.transformQuery(query)
    const result = await Avatar.getDb().update(
      query,
      wrapData({ ...data }),
      Avatar.getCollectionName()
    )

    return result.ok
  }

  static async insert (data: AvatarType): Promise<Avatar> {
    console.log(data)

    let result = await Avatar.getDb()
      .insert(
        wrapData({ ...data }),
        Avatar.getCollectionName()
      )

    console.log(result)

    let results = result
    let filtered = []
    results
      .forEach((p) => {
        if (p.type === 'avatar') {
          filtered.push(p.payload)
        }
      })

    return new Avatar(filtered[0])
  }

  serialize (): AvatarType {
    return {
      email: this.email,
      img: this.img,
      mimetype: this.mimetype
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

function wrapData (data: AvatarType): CollectionData {
  return {
    type: 'avatar',
    payload: data
  }
}
