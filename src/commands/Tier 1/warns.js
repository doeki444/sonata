const utils = require('../../utils.js');
const { Embed, Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'warns',
            description: 'Просмотр предупреждений пользователя',
            usage: '[@user/ID]'
        };
    }

    get customOptions() {
        return {
            tier: 1,
            category: 'other'
        };
    }

    async run(message, args) {
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member)
            member = message.guild.member(message.guild.members.get(message.author.id));

        let warns = '';
        Object.keys(this.client.db.warns).forEach((key) => {
            if(this.client.db.warns[key].info.member == member.user.id)
                warns += `\`#${key}\` ${this.client.db.warns[key].reason}\n`;
        });

        let embed = new Embed()
            .setColor('#00FF00')
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .setTitle('Предупреждения пользователя')
            .setDescription(warns || ":white_check_mark: Указанный пользователь чист.")
            .setThumbnail(member.user.displayAvatarURL);

        return message.channel.send(embed);
    }
};

module.exports = MyCommand;