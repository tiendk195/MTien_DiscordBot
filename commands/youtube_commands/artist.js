const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const language = require("../../language_setup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("artist")
    .setDescription(`${language.__n(`artist.command_description`)}`)
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(`${language.__n(`artist.artist_name`)}`)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const artistName = interaction.options.getString("name");
      const url = `https://api-mtiendev.onrender.com/artistVideos/${artistName}`;

      const response = await axios.get(url);
      const videos = response.data;
      const maxVideosPerEmbed = 10;

      let embeds = [];
      let currentEmbed = null;

      videos.forEach((video, index) => {
        if (index % maxVideosPerEmbed === 0) {
          if (currentEmbed) embeds.push(currentEmbed);
          currentEmbed = new MessageEmbed()
            .setTitle(`${artistName} ${language.__n(`artist.title_suffix`)}`)
            .setColor("#FF0000");
        }

        currentEmbed.addFields({
          name: video.title,
          value:
            `${language.__n(`artist.views`)}: ${video.views}\n` +
            `${language.__n(`artist.yesterday`)}: ${video.yesterday}\n` +
            `${language.__n(`artist.publish`)}: ${video.publish}\n` +
            `[Watch now](${video.url})`,
        });
      });

      if (currentEmbed) embeds.push(currentEmbed);
      if (embeds.length > 0) {
        await interaction.reply({ embeds: [embeds.shift()] });
      } else {
        await interaction.reply("No videos found.");
      }

      // Send any remaining embeds as follow-ups
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
