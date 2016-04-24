#!/usr/bin/env node

'use strict'

var dotenv = require('dotenv').config()
var openTunnel = require('./lib/ngrok-slack').openTunnel

var fs = require('fs');



var spawn = require('child_process').spawn

var prc = spawn('jenkins',  ['--httpPort=8081', '--ajp13Port=8010'])
prc.stdout.setEncoding('utf8');

prc.stdout.on('data', function (data) {
  var str = data.toString()
  var lines = str.split(/(\r?\n)/g);
  let date = new Date().toLocaleString()


  fs.writeFile("/tmp/ngrok-jenkins.log", date + " " + lines.join(""), function(err) {
      if(err) {
          return console.log(err);
      }
  })
})

prc.on('close', function (code) {
    console.log('process exit code ' + code);
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
