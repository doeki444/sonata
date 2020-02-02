const utils = require('../../utils.js');
const { Embed, Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'inf',
            description: 'Управление предупреждениями',
            usage: '[info <ID>] | [update <ID> <новая причина>] | [delete <ID>]'
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

        let command = args.shift(" ");
        if(!command)
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
        if(!['info', 'update', 'delete'].includes(command))
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
        else {
            if(command == "info") {
                let id = parseInt(args[0]);
                if(!id)
                    return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
                
                let warn = this.client.my.db.warns[id];
                if(!warn)
                    return utils.error(message, 'USER_HAS_YOUR_TIER', { message: 'Данного предупреждения в базе не найдено.' });
                if(warn.info.guild !== message.guild.id)
                    return utils.error(message, 'USER_HAS_YOUR_TIER', { message: 'Данного предупреждения в базе не найдено.' });
                
                let embed = new Embed()
                    .setColor('#00FF00')
                    .setTitle(`Предупреждение #${id}`)
                    .addField("Нарушитель", message.guild.members.get(warn.info.member))
                    .addField("Модератор", message.guild.members.get(warn.moder))
                    .addField("Причина", warn.reason)
                    .addField("Дата выдачи", utils.date(warn.time).locale("ru").format("LLL"));
        
                return message.channel.send(embed);
            }

            if(command == "update") {
                let id = parseInt(args[0]);
                if(!id)
                    return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
                
                let warn = this.client.my.db.warns[id];
                if(!warn)
                    return utils.error(message, 'USER_HAS_YOUR_TIER', { message: 'Данного предупреждения в базе не найдено.' });
                if(warn.info.guild !== message.guild.id)
                    return utils.error(message, 'USER_HAS_YOUR_TIER', { message: 'Данного предупреждения в базе не найдено.' });
                
                let newReason = args.slice(1).join(" ");
                if(!newReason)
                    newReason = 'Не указана';

                this.client.my.db.warns[id].reason = newReason;
                this.client.my.db.warns[id].moder = message.author.id;

                let embed = new Embed()
                    .setColor('#00FF00')
                    .setDescription(`:white_check_mark: Предупреждение #${id} было обновлено модератором ${message.author}.\nНовая причина: **${newReason}**`);
        
                return message.channel.send(embed);
            }

            if(command == "delete") {
                let id = parseInt(args[0]);
                if(!id)
                    return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
                
                let warn = this.client.my.db.warns[id];
                if(!warn)
                    return utils.error(message, 'USER_HAS_YOUR_TIER', { message: 'Данного предупреждения в базе не найдено.' });
                if(warn.info.guild !== message.guild.id)
                    return utils.error(message, 'USER_HAS_YOUR_TIER', { message: 'Данного предупреждения в базе не найдено.' });
                
                delete this.client.my.db.warns[id];

                let embed = new Embed()
                    .setColor('#00FF00')
                    .setDescription(`:white_check_mark: Предупреждение #${id} было удалено модератором ${message.author}.\nНовая причина: **${newReason}**`);
        
                return message.channel.send(embed);
            }
        }
    }
};

module.exports = MyCommand;