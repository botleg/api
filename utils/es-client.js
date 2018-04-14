'use strict'
const elasticsearch = require('elasticsearch')
const bodyTemplate = {
  query: {
    multi_match: {
      type: 'best_fields',
      fuzziness: 'AUTO',
      tie_breaker: 0.3,
      fields: [ 'title', 'text' ]
    }
  },
  _source: [ 'title', 'summary' ],
  from: 0,
  size: 10
}

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

  async searchPosts (query) {
    let body = bodyTemplate
    body.query.multi_match.query = query

    return this.client.search({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      body: body
    })
  }
}

module.exports = ESClient
