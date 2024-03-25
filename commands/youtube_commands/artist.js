const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios");
const language = require("../../language_setup.js");
const fs = require("fs");
const path = require("path");
const artistsData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../data/artists.json"))
);

function mapArtistName(inputName) {
  for (const artistKey in artistsData) {
    const aliases = artistsData[artistKey];
    if (
      inputName.toLowerCase() === artistKey ||
      aliases.includes(inputName.toLowerCase())
    ) {
      return artistKey;
    }
  }
  return null;
}
const artistName = mapArtistName(interaction.options.getString("name"));
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
      await interaction.deferReply();
      artistName = interaction.options.getString("name");
      const url = `https://api-mtiendev.onrender.com/artistVideos/${artistName}`;

      const response = await axios.get(url);
      const videos = response.data;
      const maxVideosPerEmbed = 10;

      const totalPages = Math.ceil(videos.length / maxVideosPerEmbed);
      let currentPage = 0;

      const updateEmbed = () => {
        const startIdx = currentPage * maxVideosPerEmbed;
        const endIdx = startIdx + maxVideosPerEmbed;
        const videosSlice = videos.slice(startIdx, endIdx);

        const embed = new MessageEmbed()
          .setTitle(`${artistName} ${language.__n(`artist.title_suffix`)}`)
          .setColor("#FF0000");

        videosSlice.forEach((video) => {
          embed.addFields({
            name: video.title,
            value:
              `${language.__n(`artist.views`)}: ${video.views}\n` +
              `${language.__n(`artist.yesterday`)}: ${video.yesterday}\n` +
              `${language.__n(`artist.publish`)}: ${video.publish}\n` +
              `[Watch now](${video.url})`,
          });
        });

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
