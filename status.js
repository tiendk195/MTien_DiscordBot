const { Client, Intents } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const language = require("./language_setup.js");

const activities = [
  { name: "watching", type: "WATCHING", text: "youtube" },
  //   { name: "watching", type: "WATCHING", text: "invite.anichan.asia" },
];

function setRandomActivity() {
  const index = Math.floor(Math.random() * activities.length);
  client.user.setActivity(activities[index].text, {
    type: activities[index].type,
  });
}
client.on("ready", () => {
  console.log(
    `Logged in as ${client.user.tag} ${language.__n(`global.status_ready`)}`
  );
  setRandomActivity();
  setInterval(() => {
    setRandomActivity();
  }, 10 * 60 * 1000);
});

client.login(process.env.BOT_TOKEN);
