'use strict'
const elasticsearch = require('elasticsearch')

class ESClient {
  constructor () {
    this.client = new elasticsearch.Client({
      host: `https://${process.env.ES_USERNAME}:${process.env.ES_PASSWORD}@${process.env.ES_HOST}`
    })
  }

  async count () {
    const res = await this.client.count({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE
    })

    return res.count
  }
}

module.exports = ESClient
