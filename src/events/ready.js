const { Event } = require('discore.js');

class MyEvent extends Event {
    run() {
        this.client.user.setPresence({ game: { type: 3, name: `за сервером | ${process.env.PREFIX}help` } });
        setInterval(() => {
            Object.keys(this.client.my.db.mutes).forEach((muteKey) => {
                if(Date.now() >= this.client.my.db.mutes[muteKey].expire) {
                    let guild = this.client.guilds.get(this.client.my.db.mutes[muteKey].info.guild);
                    let user = guild.members.get(this.client.my.db.mutes[muteKey].info.member);
                    if(!user) return delete this.client.my.db.mutes[muteKey];
                    else {
                        let muteRole = guild.roles.find('name', 'Muted');
                        user.removeRole(muteRole);
                        return delete this.client.my.db.mutes[muteKey];
                    }
                }
            });
        }, 10000);

        console.info(`Authentificated as ${this.client.user.tag} (${this.client.user.id})`);
        return this.client.generateInvite(['ADMINISTRATOR']).then(console.info);
    }
};

module.exports = MyEvent;