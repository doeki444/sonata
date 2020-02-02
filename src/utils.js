const { Embed } = require('discore.js');

var tiers = {
    1: 'USER',
    2: 'MODERATOR',
    3: 'ADMINISTRATOR',
    4: 'BOT_OWNER'
};

module.exports = {
    tiers: tiers,
    toMS: require('ms'),
    date: require('moment'),
    fridaySnippet: (number, one, two, five) => {
        number = Math.abs(number);
        number %= 100;
        if (number >= 5 && number <= 20) {
            return five;
        }
        number %= 10;
        if (number == 1) {
            return one;
        }
        if (number >= 2 && number <= 4) {
            return two;
        }
        return five;
    },
    check: (member, tier) => {
        var perms = {
            USER: true,
            MODERATOR: member.permissions.has('MANAGE_MESSAGES') || member.permissions.has('MANAGE_NICKNAMES') || member.permissions.has('KICK_MEMBERS') || member.permissions.has('BAN_MEMBERS'),
            ADMINISTRATOR: member.permissions.has('ADMINISTRATOR'),
            BOT_OWNER: member.id == process.env.BOT_OWNER
        };

        return perms[tiers[tier]];
    },
    error: (message, code, args) => {
        let embed = new Embed();
        switch (code) {
            case 'INVALID_USER_TIER':
                embed.setColor('#FF0000')
                    .setDescription(`:x: У Вас недостаточно прав для совершения данного действия.`)
                    .addField("Необходимое право", `**${tiers[args.tier]}**`);

                return message.channel.send(embed);
                break;

            case 'USER_HAS_YOUR_TIER':
                embed.setColor('#FF0000')
                    .setDescription(`:x: Вы пытаетесь совершить неправомерное действие.`)
                    .addField("В каком смысле?", args.message);

                return message.channel.send(embed);
                break;

            case 'NO_ARGS':
                embed.setColor('#FF0000')
                    .setDescription(`:x: Указано недостаточно аргументов.`)
                    .addField("Правильное использование", `\`${args.usage}\``);

                return message.channel.send(embed);
                break;
        
            default:
                return message.channel.send({ embed: { color: 0xFF0000, description: `:x: Произошла неизвестная ошибка, лол.\nОбратитесь с такой ошибкой на сервер тех. поддержки.` } });
                break;
        }
    }
};