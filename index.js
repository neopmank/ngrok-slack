'use strict'

var dotenv = require('dotenv').config()
var ngrok = require('ngrok')
var Slack = require('node-slack')


function openTunnel (config) {
  var nc = config.ngrok
  var sc = config.slack

  ngrok.connect({
    port: nc.port,
    authtoken: nc.token,
  }, function (error, url) {
    console.log("Trying to open ngrok port: " + nc.port)
    console.log('Auth. token: ' + nc.token)

    if (error) {
      throw error
    }

    console.log(url)

    var slack = new Slack(sc.hook_url)
    slack.send({
        text: url,
        channel: sc.channel,
        username: sc.username,
        icon_url: sc.icon_url,
    });

  })
}

ngrok.on('close', function () {
  setTimeout(openTunnel, 1200)
})


// Disconnect and kill ngrok process on SIGUSR2 signal (nodemon reload)
process.once('SIGUSR2', function () {
    ngrok.disconnect()
    ngrok.kill()
    process.kill(process.pid, 'SIGUSR2');
})



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
