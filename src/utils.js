var tiers = {
    1: 'USER',
    2: 'MODERATOR',
    3: 'ADMINISTRATOR',
    4: 'BOT_OWNER'
};

module.exports = {
    check: (message, tier) => {
        var perms = {
            USER: true,
            MODERATOR: message.member.permissions.has('MANAGE_MESSAGES') || message.member.permissions.has('MANAGE_NICKNAMES') || message.member.permissions.has('KICK_MEMBERS') || message.member.permissions.has('BAN_MEMBERS'),
            ADMINISTRATOR: message.member.permissions.has('ADMINISTRATOR'),
            BOT_OWNER: message.author.id == process.env.BOT_OWNER
        };
    
        return perms[tiers[tier]];
    },
    error: (message, code, args) => {
        switch (code) {
            case 'INVALID_USER_TIER':
                message.channel.send({ embed: { color: 0xFF0000, description: `:x: У Вас недостаточно прав для совершения данного действия.\nНеобходимое право: **${tiers[args.tier]}**` } });
                break;

            case 'NO_ARGS':
                message.channel.send({ embed: { color: 0xFF0000, description: `:x: Указано недостаточно аргументов.\nПравильное использование команды: \`${args.usage}\`` } });
                break;
        
            default:
                message.channel.send({ embed: { color: 0xFF0000, description: `:x: Произошла неизвестная ошибка, лол. Обратитесь к пользователю с правом **${tiers[4]}**.` } });
                break;
        }
    }
};