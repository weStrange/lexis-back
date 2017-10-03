/* eslint-env jest */
'use strict'

import dotenv from 'dotenv'
// import chai from 'chai'
import logger from 'winston'
dotenv.config()

import { User } from '~/models/'
import database from '~/models/MongoDatabase'

// let expect = chai.expect

describe('User model:', function () {
  beforeAll(async function () {
    await User.collection.drop()
    try {
      await User.find()
    } catch (error) {
      console.error(error)
    }
  })

  afterAll(function () {
    User.collection.drop().then(() => process.exit())
  })
  // const User = models.User
  // logger.info(`Testing user model. Database ${User.getDb().url} and collection ${User.getCollectionName()}`)
  it('tests whether connection works', async function () {
    await User.find({ email: 'nopestitynopes' }) // this will create the collection implicitly
    const count = await User.count()
    expect(count).toEqual(0)
  })
  it('inserts a user into the database', async function () {
    let result = await User.create({
      email: 'example@example.com',
      firstName: 'test',
      lastName: 'test',
      registrationDate: new Date().toISOString(),
      hash: 'test',
      salt: 'test'
    })
    expect(result.email).toEqual('example@example.com')
  })
  it('inserts multiple users into the database', async function () {
    let result1 = await User.create({
      email: 'example1@example.com',
      firstName: 'test',
      lastName: 'test',
      registrationDate: new Date().toISOString(),
      hash: 'test',
      salt: 'test'
    })
    let result2 = await User.create({
      email: 'example2@example.com',
      firstName: 'test',
      lastName: 'test',
      registrationDate: new Date().toISOString(),
      hash: 'test',
      salt: 'test'
    })
    let result3 = await User.create({
      email: 'example3@example.com',
      firstName: 'test',
      lastName: 'test',
      registrationDate: new Date().toISOString(),
      hash: 'test',
      salt: 'test'
    })
    expect(result1.email).toEqual('example1@example.com')
    expect(result2.email).toEqual('example2@example.com')
    expect(result3.email).toEqual('example3@example.com')
  })
  it('updates users in the database', async function () {
    let updatedCount = await User.update(
      { email: 'example1@example.com' },
      { firstName: 'Penny' }
    )

    expect(updatedCount.ok).toEqual(1)

    let mrNode = await User.findOne({ email: 'example2@example.com' })
    expect(mrNode).not.toEqual(null)
    if (mrNode !== null) {
      mrNode.lastName = 'mrNode'
      await mrNode.save()

      mrNode = await User.findOne({ lastName: 'mrNode' })
      expect(mrNode.lastName).toEqual('mrNode')
    }

    let penny = await User.findOne({ firstName: 'Penny' })
    console.log(penny, 'here should be a Peenyy')
    expect(penny.firstName).toEqual('Penny')
  })
  it('finds many users from the database', async function () {
    let usersWithLastName = await User.find({ lastName: { $exists: true } })
    expect(usersWithLastName.length).toEqual(4)
  })
  it('cleans up all the users in the database', async function () {
    let allUsers = await User.find()
    expect(allUsers.length).toEqual(4)
    await User.remove({ email: 'example@example.com' }) // delete one using instance method
    let count = await User.count()
    expect(count).toEqual(3)
    let deleteResult = await User.remove({ email: 'example1@example.com' }) // delete a user using static method

    expect(deleteResult.result.ok).toEqual(1)
    count = await User.count()
    expect(count).toEqual(2)
    await User.remove() // delete the rest
    count = await User.count()
    expect(count).toEqual(0)
  })
})
/* Test associations between user and comment
describe('Comment', function() {
  const Comment = models.Comment;
  logger.info(`Testing comment model. Database ${Comment.DB.url} and collection ${Comment.COLLECTION}`);
  it('tests whether connection works', async function() {
    await Comment.find();
    const count = await Comment.DB.collection(Comment.COLLECTION).count();
    expect(count).to.be.a('number');
  });
  it('posts a comment as a user', async function(){

  });
  it('posts another comment as a user', async function(){

  })
  it('likes a random comment', async function(){

  })
  it('updates an existing comment', async function(){

  })
  it('cleans up all the comments in the database', async function(){

  })
});
*/
