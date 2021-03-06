'use strict'
const Slack = require('slack-node')
const Promise = require('bluebird')

class SlackClient {
  constructor () {
    const slack = new Slack()
    slack.setWebhook(process.env.SLACK_URL)

    this.webhook = Promise.promisify(slack.webhook)
  }

  async postComment (id, body) {
    return this.webhook({
      channel: '#blog',
      username: 'comments',
      icon_emoji: ':notebook:',
      text: `*${id.split('-').join(' ')}*\n${body.name}: ${body.text}`
    })
  }

  async updateStory (operation, title) {
    return this.webhook({
      channel: '#blog',
      username: 'posts',
      icon_emoji: ':postbox:',
      text: `*Post ${operation}*\n${title}`
    })
  }
}

module.exports = SlackClient
