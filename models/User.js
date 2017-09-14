const MongoDatabase = require('./MongoDatabase');
const Association = require('./Association');
const Model = require('./Model')
// const Comment = require('./Comment');
const logger = require('winston');
const mongoose = require('mongoose');
const mongodb = require('mongodb')

let connectionString = process.env['MONGO_USER'] && process.env['MONGO_PASSWORD']
? `mongodb://${process.env['MONGO_USER']}:${process.env['MONGO_PASSWORD']}@${process.env['MONGO_HOST']}/lexis`
: `mongodb://${process.env['MONGO_HOST']}/lexis`
const db = new MongoDatabase(encodeURI(connectionString));

const collectionName = 'User'


// TODO: create MongoModel class and extend it instead
class User extends Model {
  constructor(data){
    super(data);
    //intiate fields that must exist before any other logic happens
    // this.comments = new Association(Comment, []);

    this.id = data._id || data.id
    this.username = data.username
    this.avatar = data.avatar
/*
    for (let [key, value] of Object.entries(data)) {
       console.log(data)
        console.log(key, value)
        switch(key){
          case 'id':
          case '_id':
            this.id = value.toString();
            break;
          case 'username':
            this.username = value;
            break;
          case 'avatar':
            this.avatar = value;
            break;
          default:
            break;
        }
    } */
  }

  //allow access to the raw mongodb driver's database instance, if it exists (ensureConnected called at least once)
  //this is like a getter for private static variable in Java
  static get DB(){
    return db;
  }

  //collection name of the model
  static get COLLECTION(){
    return collectionName;
  }

  //transform a standard query object into something compatible with this model's database - mongo
  static transformQuery(query) {
    if(query && query.id) {
      query._id = new mongodb.ObjectId(query.id);
      delete query.id;
    }
    //if query is an array of strings, assume it's a set of IDs to search for
    if(query instanceof Array && query.every(v=>typeof v === 'string')) query = { '_id': { '$in': query.map(q=>new mongodb.ObjectId(q)) } };
    return query;
  }

  static async count(query){
    query = User.transformQuery(query);

    return await User.DB.count(query, User.COLLECTION);
  }

  static async where(query){
    //transform query for this model
    query = User.transformQuery(query);

    const results = await User.DB.select(query, User.COLLECTION);
    console.log(results)
    return results.map(p => new User(p));
  }

  static async find(query){
    let results = await User.DB.select(query, User.COLLECTION);
    // results = await results.next();
    if(!results) return null;
    console.log('Beginning')
    console.log(results)
    console.log(results.map(data => new User(data)))
    console.log('End')
    return results.map(data => new User(data));
  }

  static async delete(query){
    query = User.transformQuery(query);
    const result = await User.DB.delete(query, User.COLLECTION);
    return result.result.ok
  }

  static async update(query, data){
    query = User.transformQuery(query);
    const result = await User.DB.update(query, data, User.COLLECTION);
    // console.log(result)
    return result.ok;
  }

  static async insert(data){
    data = data.map(ud=>new User(ud).serialize(true));
    const result = await User.DB.insert(data, User.COLLECTION);
    return result.map(data => new User(data));
  }

  serialize(withId) {
    const data = super.serialize();

    //this is essentially the reverse if your constructor
    //in SQL databases, you of course wanna be more strict, just
    //like in constructor and only serialize values you have columns for
    for (let [key, value] of Object.entries(this)) {
      switch(key){
        case 'id':
          if(withId) data._id = value;
          break;
        case 'username':
          data.username = value;
          break;
        case 'avatar':
          data.avatar = value;
          break;
        case 'comments':
          //handle associations as appropriate for this model
          //in this case we don't need to do anything as we assume comments
          //are saved explicitly and separately
          break;
        default:
          switch(typeof value){
            //for any 'unknown' attributes serialize them if they are one of the
            //standard primitive types
            case 'string':
            case 'number':
            case 'boolean':
            case 'null':
            case 'undefined':
              data[key] = value;
              break;
            default:
              try {
                //if the value is not primitive, then do that trick with the JSON.stringify
                JSON.stringify(value);
                data[key] = value;
              }catch(e){
                logger.error(`Could not serialize User field ${key} - ${e.message}. The field value will not be saved!`);
              }
              break;
          }
          break;
      }
  }


    try {
      JSON.stringify(data);
      return data;
    } catch(e) {
      logger.error(`Serialization error for an instance of User: ${e.message}`);
      return null;
    }
  }

  async save(id){
    let data = this.serialize();

    if(this.id || this._id){
      this.id = this.id || this._id
      //you could also do things like new mongodb.ObjectId(this.id) here if you want to be 100% compliant
      return await User.DB.update({ _id: this.id }, data, User.COLLECTION)
    } else {
      if(id) data._id = id; //allow saving under a custom ID
      //TODO: add your validations here
      let user = await User.DB.insert(data, User.COLLECTION)
      // console.log(insertOp)
      this.id = user._id.toString()
    }
    return this;
  }

  async delete() {
    const result = await User.DB.delete({ _id: this.id }, User.COLLECTION)
    // const results = await User.DB.delete({_id: {'$in': [new mongodb.ObjectId(this.id)]}}, User.COLLECTION);
    //do something with results, e.g. if CASCADE is not set, you might need to run through all associations and delete them all
    return this;
  }
}
module.exports = User;
