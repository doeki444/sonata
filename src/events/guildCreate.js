const { date } = require('../utils');
const { Event, Embed } = require('discore.js');

class MyEvent extends Event {
    run(guild) {
        let embed = new Embed()
            .setColor("#7289DA")
            .setTitle("Новый сервер")
            .setDescription(`Меня добавили на сервер ${guild.name} (ID: ${guild.id}).`)
            .addField("Администратор", `${guild.owner.user} (ID: ${guild.owner.user.id})`)
            .addField("Дата создания", date(guild.createdAt).locale("ru").format("LLLL"))
    
        return this.client.channels.get(process.env.NEW_SERVERS_CHANNEL).send(embed);
    }
};

module.exports = MyEvent;
