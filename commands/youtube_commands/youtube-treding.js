const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios");
const language = require("../../language_setup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube-trending")
    .setDescription(`${language.__n(`youtube_trending.command_description`)}`),
  async execute(interaction) {
    try {
      // Defer the reply to prevent the interaction from expiring
      await interaction.deferReply();

      const response = await axios.get(
        "https://api-mtiendev.onrender.com/treding"
      );
      const videos = response.data;
      const maxVideosPerEmbed = 10;

      const totalPages = Math.ceil(videos.length / maxVideosPerEmbed);
      let currentPage = 0;

      const updateEmbed = () => {
        const startIdx = currentPage * maxVideosPerEmbed;
        const endIdx = startIdx + maxVideosPerEmbed;
        const videosSlice = videos.slice(startIdx, endIdx);

        const embed = new MessageEmbed()
          .setTitle(`${language.__n(`youtube_trending.title`)}`)
          .setColor("#FF0000");

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

        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("prev")
            .setLabel(`${language.__n(`global.preview_button`)}`)
            .setStyle("PRIMARY")
            .setDisabled(currentPage === 0),
          new MessageButton()
            .setCustomId("next")
            .setLabel(`${language.__n(`global.next_button`)}`)
            .setStyle("PRIMARY")
            .setDisabled(currentPage === totalPages - 1)
        );

        return { embeds: [embed], components: [row] };
      };

      const reply = await interaction.editReply(updateEmbed());

      if (interaction.channel) {
        const filter = (i) => i.customId === "prev" || i.customId === "next";
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 60000,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "prev" && currentPage > 0) {
            currentPage--;
          } else if (i.customId === "next" && currentPage < totalPages - 1) {
            currentPage++;
          }
          await reply.edit(updateEmbed());
        });

        collector.on("end", () => {
          interaction.editReply({ components: [] });
        });
      } else {
        console.error("Lệnh không thể được sử dụng trong DM.");
      }
    } catch (error) {
      console.error(`${language.__n(`global.error`)}`, error);
      if (!interaction.replied) {
        await interaction.followUp(`${language.__n(`global.error_reply`)}`);
      }
    }
  },
};
