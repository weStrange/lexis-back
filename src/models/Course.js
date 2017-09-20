/* @flow */
'use strict'

import mongodb from 'mongodb'

import { List } from 'immutable'

import { getDbInstance } from './MongoDatabase'
// import Utils from '../utils'
// import Model from './Model'
import type {
  Course as CourseType,
  CollectionData,
  Level,
  Achievement
} from '../types'

const collectionName = 'Course'

export default class Course {
  _id: string;
  creatorEmail: string;
  name: string;
  students: List<string>;
  levels: List<Level>;
  achievements: List<Achievement>;

  constructor (data: CourseType) {
    // super(data)

    this._id = data.id
    this.creatorEmail = data.creatorEmail
    this.name = data.name
    this.students = data.students
    this.levels = data.levels
    this.achievements = data.achievements
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
    query = Course.transformQuery(query)

    return Course.getDb().count(query, Course.getCollectionName())
  }

  static async find (query: any): Promise<List<Course>> {
    let results = await Course.getDb()
      .select(query, Course.getCollectionName())
    // results = await results.next();
    if (!results) return List()

    let filtered = List()
    results
      .forEach((p) => {
        if (p.type === 'course') {
          filtered = filtered.push(p.payload)
        }
      })

    return filtered.map(data => new Course(data))
  }

  static async findOne (query: any): Promise<Course | null> {
    let result = (await this.find(query)).first()

    if (result) {
      return result
    }

    return null
  }

  static async delete (query: any): Promise<number> {
    query = Course.transformQuery(query)
    const result = await Course.getDb().delete(query, Course.getCollectionName())
    return result.result.ok
  }

  static async update (query: any, data: any): Promise<number> {
    query = Course.transformQuery(query)
    const result = await Course.getDb().update(
      query,
      data,
      Course.getCollectionName()
    )

    return result.ok
  }

  static async addStudent (
    courseName: string,
    studentEmail: string
  ): Promise<boolean> {
    return await Course.getDb()
      .pushToArray(
        { name: courseName },
        studentEmail,
        'students',
        Course.getCollectionName()
      )
  }

  static async removeStudent (
    courseName: string,
    studentEmail: string
  ): Promise<boolean> {
    return Course.getDb()
      .removeFromArray(
        { name: courseName },
        studentEmail,
        'students',
        Course.getCollectionName()
      )
  }

  static async insert (data: CourseType): Promise<Course> {
    // TODO: the creator's email should actually be derived from authorizaion logic at some point
    data.creatorEmail = 'test@test.com'
    let result = await Course.getDb()
      .insert(
        wrapData(data),
        Course.getCollectionName()
      )

    let results = List.of(result)
    let filtered = List()
    results
      .forEach((p) => {
        if (p.type === 'course') {
          filtered = filtered.push(p.payload)
        }
      })

    return new Course(filtered.first())
  }

  serialize (): CourseType {
    return {
      id: this._id,
      creatorEmail: this.creatorEmail,
      name: this.name,
      students: this.students,
      levels: this.levels,
      achievements: this.achievements
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

function wrapData (
  data: CourseType
): CollectionData {
  return {
    type: 'course',
    payload: data
  }
}
