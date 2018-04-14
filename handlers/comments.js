'use strict'
const ESClient = require('../utils/es-client')

exports.handler = async event => {
  try {
    const es = new ESClient()
    const res = await es.fetchComments()

    let count = 0
    let comments = []

    for (let post of res.hits.hits) {
      if (post._source.comments.length) {
        comments.push(post._source)
        count += post._source.comments.length
      }
    }

    return (null, {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: count, comments: comments })
    })
  } catch (err) {
    console.error(err.stack)
  }
}
