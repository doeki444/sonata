const { Core } = require('discore.js');
new Core({
  commandsFolder: 'commands',
  triggersFolder: 'triggers',
  eventsFolder: 'events',

  spaceAfterPrefix: false,
  ignorePrefixCase: true,
  mentionPrefix: false,

  ignoreCase: true,
  ignoreSelf: true,
  ignoreBots: true,
  splitArgs: ' ',

  prefix: process.env.PREFIX,
  token: process.env.CLIENT_TOKEN
});