const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const language = require("../../language_setup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube24h")
    .setDescription(`${language.__n(`youtube.command_description`)}`),
  async execute(interaction) {
    try {
      const response = await axios.get("http://localhost:3000/youtubeAll");
      const videos = response.data;
      const maxVideosPerEmbed = 10;
      const maxRecordsToShow = 200; // Limit to 200 records

      let embeds = [];

      for (
        let i = 0;
        i < videos.length && i < maxRecordsToShow;
        i += maxVideosPerEmbed
      ) {
        const embed = new MessageEmbed()
          .setTitle(`${language.__n(`youtube.title`)}`)
          .setColor("#FF0000");

        const videosSlice = videos.slice(i, i + maxVideosPerEmbed);
        const fields = videosSlice.map((video) => {
          return {
            name: `${video.rank}. ${video.title}`,
            value:
              `${language.__n(`youtube.views`)}: ${video.views}\n` +
              `${language.__n(`youtube.likes`)}: ${video.likes}\n` +
              `${language.__n(`youtube.change`)}: ${video.change}\n` +
              `[Watch now](${video.url})`,
          };
        });

        embed.addFields(fields);
        embeds.push(embed);
      }
      await interaction.reply({ embeds: embeds.slice(0, 1) });
      for (let j = 1; j < embeds.length; j++) {
        await interaction.followUp({ embeds: [embeds[j]] });
      }
    } catch (error) {
      console.error(`${language.__n(`global.error`)}`, error);
      if (!interaction.replied) {
        await interaction.reply(`${language.__n(`global.error_reply`)}`);
      } else {
        await interaction.followUp(`${language.__n(`global.error_reply`)}`);
      }
    }
  },
};
