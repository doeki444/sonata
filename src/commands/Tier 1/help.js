const utils = require('../../utils.js');
const { Embed, Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'help',
            description: 'Помощь по командам',
            usage: '[команда]'
        };
    }

    get customOptions() {
        return {
            tier: 1
        };
    }

    async run(message, args) {
        if(!args.join(" ")) {
            let embed = new Embed()
                .setColor('#7289DA')
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
                .setTitle("Доступные команды")
                .addField(`Прочая информация`, `[• Open-Source](https://github.com/vladciphersky/sonata) | [• Discord](https://discord.gg/kHXvVkt) | [• Invite](https://discordapp.com/api/oauth2/authorize?client_id=672406367344132116&permissions=8&scope=bot)`);

            let list = '';
            this.client.commands.filter((command) => command.customOptions.tier !== 4).forEach((command) => list += `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\` | ${command.description}\n`);

            embed.setDescription(list);
            return message.channel.send(embed);
        } else {
            let command = this.client.commands.get(args.join(" "));
            let embed = new Embed()
                .setColor('#7289DA')
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
                .setTitle(`Команда ${command.name}`)
                .addField(`Работает?`, `Да`, true)
                .addField('Уровень доступа', utils.tiers[command.customOptions.tier], true)
                .addField('Использование', `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\``, true)
                .setDescription(command.description)
                .addField('Другие триггеры команды', `\`${command.aliases.join("`, `")}\``, true);

            return message.channel.send(embed);
        }
    }
};

module.exports = MyCommand;
