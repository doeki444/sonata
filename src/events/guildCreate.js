const { Event } = require('discore.js');

class MyEvent extends Event {
    run(guild) {
        if(process.env.CLIENT_SERVER !== guild.id)
            return guild.leave();
    }
};

module.exports = MyEvent;