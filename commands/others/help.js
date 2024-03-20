const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const language = require("./../../language_setup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(`${language.__n(`help.command_description`)}`),

  async execute(interaction, commands) {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${language.__n(`help.title`)}`)
      .setDescription(`${language.__n(`help.description`)}`);

    commands.forEach((command) => {
      embed.addField(command.data.name, command.data.description);
    });

    await interaction.reply({ embeds: [embed] });
  },
};
