const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const language = require("../../language_setup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("country")
    .setDescription(`${language.__n(`country.command_description`)}`)
    .addStringOption((option) =>
      option
        .setName("country")
        .setDescription(`${language.__n(`country.country_name`)}`)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const countryName = interaction.options.getString("country");
      const url = `http://localhost:3000/countryVideos/${countryName}`;

      const response = await axios.get(url);
      const videos = response.data;
      const maxVideosPerEmbed = 10;

      let embeds = [];
      let currentEmbed = null;

      videos.forEach((video, index) => {
        if (index % maxVideosPerEmbed === 0) {
          if (currentEmbed) embeds.push(currentEmbed);
          currentEmbed = new MessageEmbed()
            .setTitle(`${countryName} ${language.__n(`country.title_suffix`)}`)
            .setColor("#FF0000");
        }

        currentEmbed.addFields({
          name: video.title,
          value:
            `${language.__n(`country.weeks`)}: ${video.weeks}\n` +
            `${language.__n(`country.peak`)}: ${video.peak}\n` +
            `${language.__n(`country.change`)}: ${video.change}\n` +
            `${language.__n(`country.peakChange`)}: ${video.peakChange}\n` +
            `${language.__n(`country.streams`)}: ${video.streams}\n` +
            `${language.__n(`country.streamsChange`)}: ${video.streamsChange}`,
        });
      });

      if (currentEmbed) embeds.push(currentEmbed);
      if (embeds.length > 0) {
        await interaction.reply({ embeds: [embeds.shift()] });
      } else {
        await interaction.reply("No videos found.");
      }
      for (const embed of embeds) {
        await interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      console.error(`${language.__n(`global.error`)}`, error);
      if (!interaction.replied) {
        await interaction.reply(`${language.__n(`global.error_reply`)}`);
      } else if (!interaction.deferred) {
        await interaction.followUp(`${language.__n(`global.error_reply`)}`);
      }
    }
  },
};
