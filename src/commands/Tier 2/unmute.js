const utils = require('../../utils.js');
const { Embed, Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'unmute',
            description: 'Открыть пользователю доступ в чат',
            usage: '<@user/ID>'
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

        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member)
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
    
        if(!this.client.my.db.mutes[`${message.guild.id}-${member.id}`])
            return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `У данного пользователя нет мута.` });
        else {
            delete this.client.my.db.mutes[`${message.guild.id}-${member.id}`];

            let muteRole = message.guild.roles.find('name', 'Muted');
            if(!muteRole) return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `Нельзя открыть доступ в чат если нет роли, лол.` });
            else member.removeRole(muteRole);

            let embed = new Embed()
                .setColor('#00FF00')
                .setDescription(`:white_check_mark: ${message.author} открыл ${member} (ID: ${member.user.id}) доступ в чат на сервере.`);

            return message.channel.send(embed);
        }
    }
};

module.exports = MyCommand;