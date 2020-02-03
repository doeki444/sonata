const utils = require('../../../utils.js');
const { Embed, Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'hug',
            description: 'Обнять пользователя',
            usage: '<@user/ID>'
        };
    }

    get customOptions() {
        return {
            tier: 1,
            category: 'reactions'
        };
    }

    async run(message, args) {
		let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!member)
			return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
	
        let embed = new Embed()
        	.setColor('#7289DA')
            .setAuthor(`${message.author.username} обнял ${member.user.username}`, message.author.displayAvatarURL)
            .setImage(await utils.neko.sfw.hug().url);

        return message.channel.send(embed);
    }
};

module.exports = MyCommand;
