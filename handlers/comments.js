'use strict'
const ESClient = require('../utils/es-client')

exports.all = async event => {
  try {
    const es = new ESClient()
    const res = await es.fetchComments()
    const filtered = res.hits.hits.filter(item => item._source.comments.length)
    const comments = filtered.map(item => item._source)
    const count = filtered.reduce((val, item) => (val + item._source.comments.length), 0)

    return (null, {
      statusCode: 200,
      headers: {
        'Cache-Control': 'max-age=600',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        count: count,
        comments: comments
      })
    })
  } catch (err) {
    console.error(err.stack)
  }
}

exports.post = async (event) => {
  try {
    const es = new ESClient()
    const res = await es.fetchCommentsPost(event.pathParameters.id)

    let body = []
    if (res.found) {
      body = res._source.comments
    }

    return (null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://botleg.com',
        'Cache-Control': 'max-age=600',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  } catch (err) {
    console.error(err.stack)
  }
}
