const utils = require('../../utils.js');
const { Embed, Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'unban',
            description: 'Разбанить пользователя',
            usage: '<ID>'
        };
    }

    get customOptions() {
        return {
            tier: 2
        };
    }

    async run(message, args) {
        if(utils.check(message.member, 2) == false)
            return utils.error(message, 'INVALID_USER_TIER', { tier: this.customOptions.tier });

        let member = args[0];
        if(!member)
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
        
        message.guild.unban(member, `${message.author.tag}`).catch(() => {
            message.channel.send(`:x: Невозможно выполнить данное действие. Возможно у бота нет прав на выполнение таких действий.`);
        });
        
        let embed = new Embed()
            .setColor('#00FF00')
            .setDescription(`:white_check_mark: ${message.author} разблокировал пользователя (ID: ${member}) на сервере.`);

        return message.channel.send(embed);
    }
};

module.exports = MyCommand;