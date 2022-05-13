//const token = process.env["TOKEN"];
require("dotenv").config();
const Discord = require("discord.js");
const { Intents } = require("discord.js");
const github = require("./modules/github");
const uwu = require("./modules/uwu");
const paidRespects = require("./modules/paidRespects");
const help = require("./modules/help");
const express = require("express");
const { REST } = require("@discordjs/rest");
const fs = require("fs");
const { Player } = require("discord-player");
const { Routes } = require("discord-api-types/v9");

const app = express();
const LOAD_SLASH = process.argv[2] === "load";
const CLIENT_ID = "969275699577901127";
//const GUILD_ID = "guild_id";  LOAD BOTS DISCORD

app.get("/", (req, res) => {
  res.send("Server ready");
});

app.listen(4000, () => {
  console.log("Latom-bot");
});

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

let commands = [];
const slashFiles = fs
  .readdirSync("./modules/slash")
  .filter((file) => file.endsWith(".js"));
for (const file of slashFiles) {
  const slashcmd = require(`./modules/slash/${file}`);
  client.slashcommands.set(slashcmd.data.name, slashcmd);
  if (LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

if (LOAD_SLASH) {
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
  console.log("Deploying slash commands");
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    })
    .then(() => {
      console.log("Successfully loaded");
      process.exit(0);
    })
    .catch((error) => {
      if (error) {
        console.log(error);
        process.exit(1);
      }
    });
} else {
  client.on("ready", () => {
    console.log(`${client.user.username} is ready!`);
  });
  client.on("interactionCreate", (interaction) => {
    const handleCommand = async () => {
      if (!interaction.isCommand()) return;

      const slashcmd = client.slashcommands.get(interaction.commandName);
      if (!slashcmd) interaction.reply("Not a valid slash command");

      await interaction.deferReply();
      await slashcmd.run({ client, interaction });
    };
    handleCommand();
  });
  client.login(process.env.TOKEN);
}

client.on("messageCreate", (message) => {
  const low = message.content;
  if (low.toLowerCase().includes("uwu")) {
    message.react("🤍");
  }
  if (low.includes("-github")) {
    github(message);
  }
  if (low.toLowerCase() === "f") {
    paidRespects(message);
  }
  if (low.toLowerCase() === "-help") {
    help(message);
  }
});

client.on("messageCreate", (message) => {
  return (GUILD_ID = message.guildId);
});
