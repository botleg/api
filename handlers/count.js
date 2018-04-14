'use strict'
const ESClient = require('../utils/es-client')

exports.handler = async event => {
  try {
    const es = new ESClient()
    const res = await es.count()

    return (null, {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: res.count })
    })
  } catch (err) {
    console.error(err.stack)
  }
}
