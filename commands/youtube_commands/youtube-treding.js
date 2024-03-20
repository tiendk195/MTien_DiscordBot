const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const language = require("../../language_setup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube-trending")
    .setDescription(`${language.__n(`youtube_trending.command_description`)}`),
  async execute(interaction) {
    try {
      const response = await axios.get("http://localhost:3000/treding");
      const videos = response.data;
      const maxVideosPerEmbed = 5;

      let embeds = [];

      for (let i = 0; i < videos.length; i += maxVideosPerEmbed) {
        const embed = new MessageEmbed()
          .setTitle(`${language.__n(`youtube_trending.title`)}`)
          .setColor("#FF0000");

        const videosSlice = videos.slice(i, i + maxVideosPerEmbed);
        const fields = videosSlice.map((video) => {
          return {
            name: `${video.rank}. ${video.title}`,
            value:
              `${language.__n(`youtube_trending.tags`)}: ${video.tags}\n` +
              `${language.__n(`youtube_trending.change`)}: ${video.change}\n` +
              `${language.__n(`youtube_trending.highlights`)}: ${
                video.highlights
              }\n` +
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
