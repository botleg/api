'use strict'
const axios = require('axios')
const ESClient = require('../utils/es-client')
const SlackClient = require('../utils/slack-client')

exports.handler = async event => {
  try {
    if (event.headers['X-Hub-Signature'] !== `sha1=${process.env.GITHUB_SECRET}`) {
      return (null, { statusCode: 401 })
    }

    const body = JSON.parse(event.body)
    const es = new ESClient()
    const slackClient = new SlackClient()

    if ('commits' in body && Array.isArray(body.commits)) {
      for (var commit of body.commits) {
        const added = commit.added.filter(item => item.includes('_posts/'))
        for (let story of added) {
          const res = await axios(process.env.GITHUB_BASE + story)
          const id = story.substring(25, story.length - 9)
          await es.indexDoc(id, res.data)
          await slackClient.updateStory('Created', res.data.split('\n')[2].slice(7))
        }

        const removed = commit.removed.filter(item => item.includes('_posts/'))
        for (let story of removed) {
          const id = story.substring(25, story.length - 9)
          await es.deleteDoc(id)
          await slackClient.updateStory('Deleted', id.split('-').join(' '))
        }

        const modified = commit.modified.filter(item => item.includes('_posts/'))
        for (let story of modified) {
          const res = await axios(process.env.GITHUB_BASE + story)
          const id = story.substring(25, story.length - 9)
          await es.updateDoc(id, res.data)
          await slackClient.updateStory('Modified', res.data.split('\n')[2].slice(7))
        }
      }
    }

    return (null, {
      statusCode: 204,
      body: null
    })
  } catch (err) {
    console.error(err.stack)
  }
}
