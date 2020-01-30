const utils = require('../../utils.js');
const { Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'kick',
            description: 'Кикнуть пользователя',
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

        member.send(`:warning: Вы кикнуты с сервера **${message.guild.name}** модератором **${message.author.tag}** (ID: ${message.author.id}).\nПричина:\`\`\`${reason}\`\`\``)
            .then(() => {
                member.kick(reason);
                return message.channel.send({ embed: { color: 0x00FF00, description: `:white_check_mark: ${message.author} кикнул ${member} (ID: ${member.user.id}) с сервера.`, fields: [{ title: 'Причина', description: `${reason}\n\n\`У пользователя закрыты личные сообщения.\`` }] } });
            }).catch(() => {
                return message.channel.send({ embed: { color: 0x00FF00, description: `:white_check_mark: ${message.author} кикнул ${member} (ID: ${member.user.id}) с сервера.`, fields: [{ title: 'Причина', description: `${reason}\n\n\`У пользователя закрыты личные сообщения.\`` }] } });
            });
    }
};

module.exports = MyCommand;