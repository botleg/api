'use strict'
const ESClient = require('../utils/es-client')

exports.handler = async event => {
  try {
    const es = new ESClient()
    const count = await es.count()

    return (null, {
      statusCode: 200,
      body: JSON.stringify({ count: count })
    })
  } catch (err) {
    console.error(err.stack)
  }
}
