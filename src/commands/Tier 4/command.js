const utils = require('../../utils.js');
const { Command } = require('discore.js');

class MyCommand extends Command {
    get options() {
        return {
            enabled: true,
            name: 'command',
            description: 'Управление командами',
            usage: '<toggle/load/reload/unload> <команда>'
        };
    }

    get customOptions() {
        return {
            tier: 4
        };
    }

    run(message, args) {
        if(utils.check(message.member, 4) !== true)
            return utils.error(message, 'INVALID_USER_TIER', { tier: this.customOptions.tier });

        const command = args.shift(" ");
        if(!command)
            return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });
        
        if(command == 'toggle') {
            let command = args.join(" ");
            if(!command)
                return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });

            try {
                this.client.commands.get(command).toggle();
                return message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
        }

        if(command == 'load') {
            let command = args.join(" ");
            if(!command)
                return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });

            try {
                this.client.commands.load(command);
                return message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
        }

        if(command == 'reload') {
            let command = args.join(" ");
            if(!command)
                return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });

            try {
                this.client.commands.get(command).reload();
                return message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
        }

        if(command == 'unload') {
            let command = args.join(" ");
            if(!command)
                return utils.error(message, 'NO_ARGS', { usage: `${this.client.prefix + this.options.name} ${this.options.usage}` });

            try {
                this.client.commands.get(command).unload();
                return message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
        }
    }
};

module.exports = MyCommand;
