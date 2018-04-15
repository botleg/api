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

  async fetchCommentsPost (id) {
    return this.client.get({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      id: id,
      _source: ['comments']
    })
  }

  async searchPosts (query, from = 1) {
    let body = bodyTemplate
    body.query.multi_match.query = query
    body.from = (from - 1) * body.size

    return this.client.search({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      body: body
    })
  }

  async updateComments (id, comments) {
    return this.client.update({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      id: id,
      body: {
        doc: {
          comments: comments
        }
      }
    })
  }
}

module.exports = ESClient
