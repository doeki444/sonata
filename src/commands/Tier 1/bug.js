const { date, fridaySnippet } = require('../utils');
const { Command, Embed } = require('discore.js');

class MyCommand extends MyCommand {
    run(message, args) {
        let bug = args.join(" ");
        let guild = message.guild;
        let servers = this.client.guilds.size;
        let nouns = ['сервер', 'сервера', 'серверов'];
        
        let embed = new Embed()
            .setColor("#7289DA")
            .setTitle("Найден возможный баг")
            .setDescription(`${message.author} (ID: ${message.author.id}) отправил репорт о возможно найденном баге с сервера ${guild.name} (ID: ${guild.id}).\nУ меня есть ${servers} ${fridaySnippet(servers, ...nouns)}, к слову.\n\nБаг:\`\`\`${bug}\`\`\``)
            .setThumbnail(guild.iconURL)
            .addField("Администратор сервера", `${guild.owner.user} (ID: ${guild.owner.user.id})`)
            .addField("Дата создания сервера", date(guild.createdAt).locale("ru").format("LLLL"))
    
        return this.client.channels.get(process.env.NEW_SERVERS_CHANNEL).send(embed);
    }
};

module.exports = MyCommand;
