const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of all available commands"),
  async execute(interaction) {
    // Create an instance of MessageEmbed for a rich embed message
    const helpEmbed = new MessageEmbed()
      .setTitle("Help - List of available commands")
      .setDescription("Here are all the commands you can use:")
      .setColor("#00FFFF");

    const commandsArray = interaction.client.commands.map((command) =>
      command.data.toJSON()
    );
    for (const command of commandsArray) {
      helpEmbed.addField(
        `/${command.name}`,
        command.description || "No description",
        false
      );
    }
    await interaction.reply({ embeds: [helpEmbed] });
  },
};
