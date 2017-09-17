/* @flow */
'use strict'

class Association extends Array {
  constructor (classObject, records) {
    super()
    if (typeof classObject !== 'function') throw new Error(`Attempted to pass ${classObject} as an association class, but it's type was ${typeof classObject}`)
    if (!records) throw new Error('Association invalid - records\'s were undefined, must be array')
    this.records = records
    this.length = this.records.length || 0
    this.model = classObject
    this.records.forEach(r => {
      if (typeof r === 'object') {

      }
    })
  }

  // This can be extended to support ordering, or custom query parameters for the underlying
  // associated models, or whatever else you might need
  async get (indexOrOptions) {
    let records = await this.model.where(this.records)
    for (let i = 0; i < this.length; i++) {
      // you can probably just assume the order here
      this[i] = records.find(r => r.id === this[i])
    }
    this.populated = true
    return this
  }

  async save () {
    for (let i = 0; i < this.length; i++) {
      if (this[i].id) {
        // assume its a populated record
        this[i].save()
      }
    }
  }

  async delete () {
    return this.model.delete(this.records)
  }
}

module.exports = Association
