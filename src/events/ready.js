const { Event } = require('discore.js');

class MyEvent extends Event {
    run() {
        this.client.user.setPresence({ game: { type: 3, name: `за сервером | ${process.env.PREFIX}help` } });
        console.info(`Authentificated as ${this.client.user.tag} (${this.client.user.id})`);
        return this.client.generateInvite(['ADMINISTRATOR']).then(console.info);
    }
};

module.exports = MyEvent;