const fs = require('fs');
const { Core } = require('discore.js');
const VSClient = require('vimestats');

const client = new Core({
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

VSClient(
    process.env.CLIENT_TOKEN,
    `${process.env.PREFIX.replace('.', 'v.')}`,
    {
        info: "#7289DA",
        error: "RED",
        warn: "#FBFF00"
    }
);

var dbFile = './src/data.json';
client.my = {
    db: JSON.parse(fs.readFileSync(dbFile, "utf8"))
};

setInterval(() => {
    fs.writeFileSync(dbFile, JSON.stringify(client.my.db, null, 4), 'utf8');
}, 15000);
