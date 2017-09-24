/* @flow */
'use strict'

import mongodb from 'mongodb'

// import { List } from 'immutable'

import { getDbInstance } from './MongoDatabase'
// import Utils from '../utils'
// import Model from './Model'
import type {
  Course as CourseType,
  CollectionData,
  Level,
  Achievement,
  CourseDifficulty,
  CourseQueryPayload,
  CourseInsertPayload
} from '../types'

const collectionName = 'Course'

export default class Course {
  _id: string;
  creatorEmail: string;
  name: string;
  description: string;
  students: Array<string>;
  levels: Array<Level>;
  achievements: Array<Achievement>;
  difficulty: CourseDifficulty;

  constructor (data: CourseType) {
    // super(data)

    this._id = data.id
    this.creatorEmail = data.creatorEmail
    this.name = data.name
    this.description = data.description
    this.students = data.students
    this.levels = data.levels
    this.achievements = data.achievements
    this.difficulty = data.difficulty
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

  static async find (query: CourseQueryPayload): Promise<Array<Course>> {
    let results = await Course.getDb()
      .select(query, Course.getCollectionName())
    // console.log(results, query)
    // results = await results.next();
    if (!results) return []

    let filtered = []
    results
      .forEach((p) => {
        if (p.type === 'course') {
          filtered.push(p.payload)
        }
      })

    return filtered.map(data => new Course(data))
  }

  static async findOne (query: CourseQueryPayload): Promise<Course | null> {
    let result = (await this.find(query))[0]

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
    return Course.getDb()
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

  static async insert (data: CourseInsertPayload): Promise<Course> {
    // TODO: the creator's email should actually be derived from authorizaion logic at some point
    data = {
      ...data,
      creatorEmail: 'test@test.com'
    }
    let result = await Course.getDb()
      .insert(
        wrapData(data),
        Course.getCollectionName()
      )
/*
    let results = result
    let filtered = []
    results
      .forEach((p) => {
        if (p.type === 'course') {
          filtered.push(p.payload)
        }
      })
*/
    return new Course(result.payload)
  }

  serialize (): CourseType {
    return {
      id: this._id,
      creatorEmail: this.creatorEmail,
      name: this.name,
      description: this.description,
      students: this.students,
      levels: this.levels,
      achievements: this.achievements,
      difficulty: this.difficulty
    }
  }
}

function wrapData (
  data: any
): CollectionData {
  return {
    type: 'course',
    payload: data
  }
}
