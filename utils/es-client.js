'use strict'
const elasticsearch = require('elasticsearch')

class ESClient {
  constructor () {
    this.client = new elasticsearch.Client({
      host: `https://${process.env.ES_USERNAME}:${process.env.ES_PASSWORD}@${process.env.ES_HOST}`
    })
  }

  async count () {
    return this.client.count({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE
    })
  }

  async fetchComments () {
    return this.client.search({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      body: {
        size: 1000,
        _source: [ 'title', 'comments' ]
      }
    })
  }
}

module.exports = ESClient
