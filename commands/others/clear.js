const { SlashCommandBuilder } = require("@discordjs/builders");
const language = require("../../language_setup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(`${language.__n(`clear.command_description`)}`)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`${language.__n(`clear.amount_description`)}`)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      if (interaction.inGuild()) {
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
          return interaction.reply(`${language.__n(`global.no_permission`)}`);
        }
      }

      const channel = interaction.channel;
      const user = interaction.user;
      const amount = interaction.options.getInteger("amount");
      let messages;
      if (channel.type === "GUILD_TEXT") {
        messages = await channel.messages.fetch({ limit: amount });
      } else {
        messages = await user.dmChannel.messages.fetch({ limit: amount });
      }
      messages.forEach(async (message) => {
        await message.delete();
      });
      if (channel.type === "GUILD_TEXT") {
        await interaction.reply(
          `${language.__n(`clear.channel_clear`)} ${channel}`
        );
      } else {
        await interaction.reply(`${language.__n(`clear.dm_clear`)} ${user}`);
      }
    } catch (error) {
      console.error(`${language.__n(`global.error`)}`, error);
      await interaction.reply(`${language.__n(`global.error_reply`)}`);
    }
  },
};
