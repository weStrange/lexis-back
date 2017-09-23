/* @flow */
'use strict'

import mongodb from 'mongodb'

// import { List } from 'immutable'

import { getDbInstance } from './MongoDatabase'
import Utils from '../utils'
// import Model from './Model'
import type {
  User as UserType,
  CollectionData,
  Credentials,
  UserWithCreds,
  Role,
  Gender
} from '../types'

const collectionName = 'User'

export default class User {
  _id: any;
  email: string;
  firstName: string;
  lastName: string;
  registrationDate: string;
  birthday: ?string;
  gender: ?Gender;
  role: Role;
  courses: Array<string>
  avatarUrl: ?string

  constructor (data: UserType) {
    // super(data)

    this.email = data.email
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.registrationDate = data.registrationDate
    this.birthday = data.birthday
    this.gender = data.gender
    this.role = data.role
    this.courses = data.courses
    this.avatarUrl = data.avatarUrl
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
    query = User.transformQuery(query)

    return User.getDb().count(query, User.getCollectionName())
  }
/*
  static async where (query: any): Promise<List<User>> {
    // transform query for this model
    query = User.transformQuery(query)

    const results = await User.getDb().select(query, User.getCollectionName())

    let filtered = List()
    results
      .forEach((p) => {
        if (p.type === 'user') {
          filtered = filtered.push(Utils.stripCreds(p.payload))
        }
      })

    return filtered.map(data => new User(data))
  }
*/

  static async addCourse (
    courseName: string,
    studentEmail: string
  ): Promise<boolean> {
    return await User.getDb()
      .pushToArray(
        { email: studentEmail },
        courseName,
        'courses',
        User.getCollectionName()
      )
  }

  static async removeCourse (
    courseName: string,
    studentEmail: string
  ): Promise<boolean> {
    return User.getDb()
      .removeFromArray(
        { name: courseName },
        studentEmail,
        'courses',
        User.getCollectionName()
      )
  }

  static async find (query: any): Promise<Array<User>> {
    let results = await User.getDb().select(query, User.getCollectionName())
    // console.log(results)
    // results = await results.next();
    if (!results) return []

    let filtered = []
    results
      .forEach((p) => {
        if (p.type === 'user') {
          filtered.push(Utils.stripCreds(p.payload))
        }
      })

    return filtered.map(data => new User(data))
  }

  static async findOne (query: any): Promise<User | null> {
    let result = (await this.find(query))[0]

    if (result) {
      return result
    }

    return null
  }

  static async findCreds (email: string): Promise<Credentials | null> {
    let results = await User.getDb().select({ email }, User.getCollectionName())
    let firstResult = results.first()
    // results = await results.next();
    if (
      !results ||
      results.size === 0 ||
      firstResult.type !== 'user'
    ) {
      return null
    }

    return {
      email,
      hash: firstResult.payload.hash,
      salt: firstResult.payload.salt
    }
  }

  static async delete (query: any): Promise<number> {
    query = User.transformQuery(query)
    const result = await User.getDb().delete(query, User.getCollectionName())
    return result.result.ok
  }

  static async update (query: any, data: any): Promise<number> {
    query = User.transformQuery(query)
    const result = await User.getDb().update(
      query,
      data,
      User.getCollectionName()
    )

    return result.ok
  }

  static async updateWithCreds (query: any, data: UserType, credentials: Credentials): Promise<number> {
    query = User.transformQuery(query)
    const result = await User.getDb().update(
      query,
      wrapData({ ...data, ...credentials }),
      User.getCollectionName()
    )

    return result.ok
  }

  static async insert (data: UserType, credentials: Credentials): Promise<User> {
    let result = await User.getDb()
      .insert(
        wrapData({ ...data, ...credentials }),
        User.getCollectionName()
      )

    let actualResult = Utils.stripCreds(result.payload)
    /*
    let results = result
    let filtered = []
    results
      .forEach((p) => {
        if (p.type === 'user') {
          filtered.push()
        }
      }) */

    return new User(actualResult)
  }

  serialize (): UserType {
    return {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      registrationDate: this.registrationDate,
      birthday: this.birthday,
      gender: this.gender,
      role: this.role,
      courses: this.courses,
      avatarUrl: this.avatarUrl
    }
  }
}

function wrapData (
  data: UserWithCreds
): CollectionData {
  return {
    type: 'user',
    payload: data
  }
}
