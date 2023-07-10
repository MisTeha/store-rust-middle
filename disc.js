const { Client, GatewayIntentBits, Collection, Events } = require('discord.js')
const { discordToken, guildId, vipRoleId, logChannelId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const EventEmitter = require('events')

class Disc extends EventEmitter {
    constructor(log) {
        super();
        this.logger = log

        this.client;

        this.guild;
        this.logChannel;
        this.vipRole;

        this.unsent = [];
    }

    init() {
        return new Promise(async (resolve, reject) => {
            const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
            client.once('ready', () => {
                this.guild = client.guilds.cache.get(guildId);
                this.logChannel = this.guild.channels.cache.get(logChannelId);
                this.vipRole = this.guild.roles.cache.get(vipRoleId);
                this.client = client;


                client.commands = new Collection();

                const commandsPath = path.join(__dirname, 'commands');
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const command = require(filePath);
                    // Set a new item in the Collection with the key as the command name and the value as the exported module
                    if ('data' in command && 'execute' in command) {
                        client.commands.set(command.data.name, command);
                    } else {
                        this.logger.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`, true);
                    }
                }
                client.on(Events.InteractionCreate, async interaction => {
                    if (!interaction.isChatInputCommand()) return;

                    const command = interaction.client.commands.get(interaction.commandName);

                    if (!command) {
                        this.logger.log(`No command matching ${interaction.commandName} was found.`);
                        return;
                    }

                    try {
                        const res = await command.execute(interaction);
                        this.emit('addVip', res);
                    } catch (error) {
                        console.warn(error);
                        this.logger.log(error.message)
                        try {
                            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                        } catch (err) {
                            console.log(err)
                        }
                    }
                });
                this.logger.log('Discord bot ready', true)
                resolve();
            });
            client.login(discordToken);
        });

    }

    findUser(tag) {
        const member = this.guild.members.cache.find(member => member.user.tag === tag);
        if (!member) {
            this.logger.log("Couldn't find user " + tag)
        }
        return member
    }

    removeVipRole(tag) {
        return new Promise(async (resolve, reject) => {
            try {
                const member = this.findUser(tag);
                await member.roles.remove(this.vipRole);
                this.logger.log(`Removed VIP role from <@${member.user.id}> (${tag})`)
            } catch (e) {
                this.logger.log(`Couldn't remove VIP role from ${tag}`)
                console.warn(e)
            }
            resolve()
        });

    }

    addVipRole(tag) {
        return new Promise(async (resolve, reject) => {
            try {
                const member = this.findUser(tag);
                await member.roles.add(this.vipRole);
                this.logger.log(`Added VIP role to <@${member.user.id}> (${tag})`)
                resolve();
            } catch (err) {
                this.logger.log(err.message, true)
                console.error(err)
                resolve()
            }

        });

    }

    dLog(message) {
        this.logChannel.send(message);
    }
}

module.exports = Disc;