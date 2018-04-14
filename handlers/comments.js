'use strict'
const ESClient = require('../utils/es-client')

exports.handler = async event => {
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
