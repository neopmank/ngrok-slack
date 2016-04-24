#!/usr/bin/env node

'use strict'

var dotenv = require('dotenv').config()
var openTunnel = require('./lib/ngrok-slack').openTunnel

var config = {
  ngrok: {
    port: process.env.NGROK_PORT,
    token: process.env.NGROK_AUTH_TOKEN,
  },
  slack: {
    hook_url: process.env.SLACK_HOOK_URL,
    channel: process.env.SLACK_CHANNEL,
    username: process.env.SLACK_USERNAME,
    icon_url: process.env.SLACK_ICON_URL,
  },
}

openTunnel(config)
