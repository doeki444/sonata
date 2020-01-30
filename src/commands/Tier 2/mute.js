const utils = require('../../utils.js');
const { Embed, Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'mute',
            description: 'Закрыть пользователю доступ в чат',
            usage: '<@user/ID> <время> [причина]'
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
    
        if(utils.check(member, 2) == true || utils.check(member, 3) == true)
            return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `Вы выбрали пользователя с правом **${utils.tiers[2]}**/**${utils.tiers[3]}**.` });

        if(member.id == message.author.id)
            return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `Вы указали себя.` });

        if(member.user.bot == true)
            return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `Вы указали бота.` });

        let muteTime = args[1];
        if(!muteTime)
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });

        let reason = args.slice(2).join(' ');
        if(!reason)
            reason = 'Не указана';

        if(this.client.my.db.mutes[`${message.guild.id}-${member.id}`])
            return utils.error(message, 'USER_HAS_YOUR_TIER', { message: `Данный пользователь уже находится в муте.\nПричина: **${this.client.my.db.mutes[`${message.guild.id}-${member.id}`].reason}**` });
        else {
            const sym = muteTime.split('').reverse()[0];
            const time = muteTime.slice(0, -1);
            const nouns = [];

            switch (sym) {
                case 's':
                    nouns[0] = 'секунду';
                    nouns[1] = 'секунды';
                    nouns[2] = 'секунд';
                    break;

                case 'm':
                    nouns[0] = 'минуту';
                    nouns[1] = 'минуты';
                    nouns[2] = 'минут';
                    break;

                case 'h':
                    nouns[0] = 'час';
                    nouns[1] = 'часа';
                    nouns[2] = 'часов';
                    break;

                case 'd':
                    nouns[0] = 'день';
                    nouns[1] = 'дня';
                    nouns[2] = 'дней';
                    break;
            }

            let timeNow = Date.now();
            this.client.my.db.mutes[`${message.guild.id}-${member.id}`] = {
                info: { guild: message.guild.id, member: member.id },
                moder: message.author.id,
                time: timeNow,
                expire: timeNow + utils.toMS(muteTime),
                reason: reason
            };

            let muteRole = message.guild.roles.find('name', 'Muted');
            if(!muteRole) {
                try {
                    muterole = await message.guild.createRole({
                        name: "Muted",
                        color: "#36393f",
                        permissions: []
                    });

                    message.guild.channels.forEach(async (channel) => {
                        await channel.overwritePermissions(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    });
                } catch (e) {
                    message.channel.send(`:x: Не удалось создать роль для мута:\`\`\`js\n${e.stack}\n\`\`\`Обратитесь с такой ошибкой на сервер тех. поддержки.`);
                }
            } else member.addRole(muteRole);

            let embed = new Embed()
                .setColor('#00FF00')
                .setDescription(`:white_check_mark: ${message.author} закрыл ${member} (ID: ${member.user.id}) доступ в чат на сервере.`)
                .addField("Причина", reason)
                .addField("Время блокировки", `${time} ${utils.fridaySnippet(time, ...nouns)}`);

            return message.channel.send(embed);
        }
    }
};

module.exports = MyCommand;