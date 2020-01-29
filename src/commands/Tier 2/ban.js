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

    async run(message, args) {
        if(!utils.check(message, 2))
            return utils.error(message, 'INVALID_USER_TIER', { tier: this.customOptions.tier });

        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member)
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
    
        let reason = args.slice(1).join(' ');
        if(!reason)
            reason = 'Не указана';

        const m = await message.channel.send({ embed: { color: 0xFFFF00, description: `:warning: Подтвердите действие: блокировка пользователя ${member} (ID: ${member.user.id}) по причине **${reason}**` } });
        await m.react('✅');
        await m.react('❌');
            
        const filter = (reaction, user) => (['✅', '❌'].includes(reaction.emoji.name) && user.id == message.author.id);
        const collector = m.createReactionCollector(filter, { time: 15000 });
            
        collector.on('collect', (reaction) => {
            m.clearReactions();
            if(reaction.emoji.name == '✅') {
                m.edit({ embed: { color: 0x7289DA, description: `:white_check_mark: ${member} (ID: ${member.user.id}) был забанен на сервере по причине **${reason}**` } });
                member.ban(reason);
                return collector.stop();
            } else {
                m.edit({ embed: { color: 0xFF0000, description: `:x: Действие отменено: блокировка пользователя ${member} (ID: ${member.user.id}) по причине **${reason}**` } });
            }
        });
    }
};

module.exports = MyCommand;