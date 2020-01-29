const utils = require('../../utils.js');
const { Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'ban',
            description: 'Забанить пользователя',
            usage: '<@user/ID> [причина]'
        };
    }

    get customOptions() {
        return {
            tier: 2
        };
    }

    run(message, args) {
        if(!utils.check(message, 2))
            return utils.error(message, 'INVALID_USER_TIER', { tier: this.customOptions.tier });

        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member)
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
    
        let reason = args.slice(1).join(' ');
        if(!reason)
            reason = 'Не указана';

        utils.collector(message, args, this.options.name, { member, reason });
    }
};

module.exports = MyCommand;