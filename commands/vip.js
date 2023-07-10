const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

const asi = new SlashCommandBuilder()
    .setName('vip')
    .setDescription('Gives VIP to given player.')
    .addStringOption(option =>
        option.setName('steamid')
            .setDescription("The player's Steam ID").setRequired(true)
    )
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The player\'s Discord user.').setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('days')
            .setDescription('How many days the VIP will last.').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

module.exports = {
    data: asi,
    async execute(interaction) {
        const steamid = interaction.options.getString('steamid');
        const user = interaction.options.getUser('user');
        const days = interaction.options.getInteger('days');

        const tag = user.tag;
        await interaction.reply({ content: 'VIP added.', ephemeral: true });
        return { steamid: steamid, discordTag: tag, days: days, tokens: 0 };
    }
}