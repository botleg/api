'use strict'
const ESClient = require('../utils/es-client')

exports.handler = async event => {
  try {
    const es = new ESClient()
    const res = await es.searchPosts(event.pathParameters.query)

    const posts = res.hits.hits.map(item => {
      item._source.id = item._id
      return item._source
    })

    return (null, {
      statusCode: 200,
      headers: {
        'Cache-Control': 'max-age=3600',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        total: res.hits.total,
        results: posts
      })
    })
  } catch (err) {
    console.error(err.stack)
  }
}
