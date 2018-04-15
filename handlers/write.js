'use strict'
const ESClient = require('../utils/es-client')
const SlackClient = require('../utils/slack-client')

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
    const slackClient = new SlackClient()
    const id = event.pathParameters.id
    const res = await es.fetchCommentsPost(id)

    if (res.found) {
      let comments = res._source.comments
      comments.unshift(body)

      await es.updateComments(id, comments)
      await slackClient.postComment(id, body)
      return genResponse(true)
    } else {
      return genResponse(false)
    }
  } catch (err) {
    console.error(err.stack)
  }
}
