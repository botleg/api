'use strict'
const ESClient = require('../utils/es-client')

const genResponse = state => {
  return (null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(state)
  })
}

exports.handler = async event => {
  try {
    const body = JSON.parse(event.body)
    if (!('name' in body) || !('text' in body) || body.name.trim() === '' || body.text.trim() === '') {
      return genResponse(false)
    }

    const es = new ESClient()
    const res = await es.fetchCommentsPost(event.pathParameters.id)

    if (res.found) {
      let comments = res._source.comments
      comments.unshift(body)

      await es.updateComments(event.pathParameters.id, comments)
      return genResponse(true)
    } else {
      return genResponse(false)
    }
  } catch (err) {
    console.error(err.stack)
  }
}
