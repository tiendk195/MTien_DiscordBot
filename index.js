const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const dotenv = require("dotenv");
const { Routes } = require("discord-api-types/v10");
const { REST } = require("@discordjs/rest");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const language = require("./language_setup.js");
const commands = new Collection();
require("./status.js");
dotenv.config();
const token = process.env.BOT_TOKEN;
const commandFolder = fs.readdirSync("./commands");
for (const folder of commandFolder) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    commands.set(command.data.name, command);
  }
}

function printAsciiArt() {
  console.log(`
  __  __ _____ _            ____        _   
 |  \/  |_   _(_) ___ _ __ | __ )  ___ | |_ 
 | |\/| | | | | |/ _ \ '_ \|  _ \ / _ \| __|
 | |  | | | | | |  __/ | | | |_) | (_) | |_ 
 |_|  |_| |_| |_|\___|_| |_|____/ \___/ \__|
                                                                                                                  
  Developed by: https://github.com/tiendk195
  Repo: https://github.com/tiendk195/MTien_DiscordBot
  `);
}

client.once("ready", () => {
  console.clear();
  printAsciiArt();
  console.log(
    `Logged in as ${client.user.tag} ${language.__n(`global.ready`)}`
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  const command = commands.get(commandName);
  if (!command) return;

  try {
    if (commandName === "help") {
      await command.execute(interaction, commands);
    } else {
      await command.execute(interaction);
    }
  } catch (error) {
    console.error(error);
    interaction.reply(`${language.__n(`global.command_error`)}`);
  }
});

client.login(token).then(() => {
  console.log(`${language.__n(`global.waiting_command`)}`);
  const commandsArray = commands.map((command) => command.data.toJSON());
  const rest = new REST({ version: "10" }).setToken(token);
  rest
    .put(Routes.applicationCommands(client.user.id), { body: commandsArray })
    .then(console.log(`${language.__n(`global.waiting_command`)}`))
    .catch((error) =>
      console.error(`${language.__n(`global.command_register_error`)}`, error)
    );
});

client.on("guildCreate", async (guild) => {
  try {
    console.log(
      `${language.__n(`global.guild_join`)}: ${guild.name} (ID: ${guild.id}).`
    );

    const commandsArray = commands.map((command) => command.data.toJSON());
    const rest = new REST({ version: "10" }).setToken(token);

    await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), {
      body: commandsArray,
    });

    console.log(
      `${language.__n(`global.command_register`)}: ${guild.name} (ID: ${
        guild.id
      })`
    );
  } catch (error) {
    console.error(
      `${language.__n(`global.server_register_error`)} ${guild.name} (ID: ${
        guild.id
      })`,
      error
    );
  }
});

client.on("guildMemberAdd", (member) => {
  const { user } = member;
  const avatarURL = user.displayAvatarURL({
    format: "png",
    dynamic: true,
    size: 256,
  });
  const username = user.username;

  const welcomeMessage = `${language.__n(
    "global.welcome_message"
  )} ${username}! ${language.__n("global.welcome")}`;

  const generalChannel = member.guild.systemChannel;
  if (generalChannel) {
    generalChannel.send({
      content: welcomeMessage,
      files: [avatarURL],
    });
  } else {
    console.log("General channel not found.");
  }
});
