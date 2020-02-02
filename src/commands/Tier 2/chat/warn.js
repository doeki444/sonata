const utils = require('../../../utils.js');
const { Embed, Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'warn',
            description: 'Выдать предупреждение пользователю',
            usage: '<@user/ID> [причина]'
        };
    }

    get customOptions() {
        return {
            tier: 2,
            category: 'moderation'
        };
    }

    async run(message, args) {
        if(utils.check(message.member, 2) == false)
            return utils.error(message, 'INVALID_USER_TIER', { tier: this.customOptions.tier });

        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member)
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
    
        if(utils.check(member, 2) == true || utils.check(member, 3) == true)
            return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `Вы выбрали пользователя с правом **${utils.tiers[2]}**/**${utils.tiers[3]}**.` });

        if(member.id == message.author.id)
            return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `Вы указали себя.` });

        if(member.user.bot == true)
            return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `Вы указали бота.` });

        let reason = args.slice(1).join(' ');
        if(!reason)
            reason = 'Не указана';

        this.client.my.db.warns[utils.generateID(8)] = {
            info: { guild: message.guild.id, member: member.id },
            moder: message.author.id,
            time: timeNow,
            reason: reason
        };

        let embed = new Embed()
            .setColor('#00FF00')
            .setDescription(`:white_check_mark: ${message.author} предупредил ${member} (ID: ${member.user.id}).`)
            .addField("Причина", reason);

        return message.channel.send(embed);
    }
};

module.exports = MyCommand;
