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
            tier: 1,
            category: 'other'
        };
    }

    async run(message, args) {
        if(!args.join(" ")) {
            let embed = new Embed()
                .setColor('#7289DA')
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
                .setTitle("Доступные команды")
                .addField(`Прочая информация`, `[• Open-Source](https://sonata.org.ru/github) | [• Discord](https://sonata.org.ru/discord) | [• Invite](https://sonata.org.ru/invite)`);

            let commands = {
                moderation: '',
                music: '',
                economy: '',
                reactions: '',
                games: '',
                other: ''
            };

            this.client.commands.filter((command) => command.customOptions.category == "moderation").forEach((command) => commands.moderation += `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\` | ${command.description}\n`);
            this.client.commands.filter((command) => command.customOptions.category == "music").forEach((command) => commands.music += `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\` | ${command.description}\n`);
            this.client.commands.filter((command) => command.customOptions.category == "economy").forEach((command) => commands.economy += `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\` | ${command.description}\n`);
            this.client.commands.filter((command) => command.customOptions.category == "reactions").forEach((command) => commands.reactions += `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\` | ${command.description}\n`);
            this.client.commands.filter((command) => command.customOptions.category == "games").forEach((command) => commands.games += `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\` | ${command.description}\n`);
            this.client.commands.filter((command) => command.customOptions.category == "other").forEach((command) => commands.other += `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\` | ${command.description}\n`);

            embed.addField('Модерация', commands.moderation || "Команд в данной категории нет, либо они ещё разрабатываются. :/");
            embed.addField('Музыка', commands.music || "Команд в данной категории нет, либо они ещё разрабатываются. :/");
            embed.addField('Экономика', commands.economy || "Команд в данной категории нет, либо они ещё разрабатываются. :/");
            embed.addField('Реакции', commands.reactions || "Команд в данной категории нет, либо они ещё разрабатываются. :/");
            embed.addField('Игры', commands.games || "Команд в данной категории нет, либо они ещё разрабатываются. :/");
            embed.addField('Прочее', commands.other || "Команд в данной категории нет, либо они ещё разрабатываются. :/");

            return message.channel.send(embed);
        } else {
            let command = this.client.commands.get(args.join(" "));
            if(!command)
                return utils.error(message, 'USER_HAS_YOUR_TIER', { message: 'Данной команды не существует.' });

            let categories = {
                moderation: 'Модерация',
                music: 'Музыка',
                economy: 'Экономика',
                reactions: 'Реакции',
                games: 'Игры'
            };

            let embed = new Embed()
                .setColor('#7289DA')
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
                .setTitle(`Команда ${command.name}`)
                .setDescription(command.description)
                .addField(`Работает?`, (command.enabled) ? ":white_check_mark: Да" : ":x: Нет", true)
                .addField('Категория', categories[сommand.customOptions.category] || "Отсутствует", true)
                .addField('Использование', `\`${this.client.prefix}${command.name}${(command.usage == null ? '' : ` ${command.usage}`)}\``, true)
                .addField('Другие триггеры команды', `[\`${command.aliases.join("`, `") || '<отсутствуют>'}\`]`, true);

            return message.channel.send(embed);
        }
    }
};

module.exports = MyCommand;
