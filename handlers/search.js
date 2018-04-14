'use strict'
const ESClient = require('../utils/es-client')

const processResults = async (...args) => {
  const es = new ESClient()
  const res = await es.searchPosts(...args)

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
}

exports.single = async event => {
  try {
    return processResults(event.pathParameters.query)
  } catch (err) {
    console.error(err.stack)
  }
}

exports.paginated = async event => {
  try {
    return processResults(event.pathParameters.query, event.pathParameters.page)
  } catch (err) {
    console.error(err.stack)
  }
}
