const token = process.env['TOKEN']
const Discord = require("discord.js");
const { Intents } = require("discord.js");
const github = require("./modules/github");
const uwu = require("./modules/uwu");
const paidRespects = require("./modules/paidRespects")
const help = require("./modules/help")
const express = require("express")

const app = express()

app.get("/", (req, res) => {
  res.send("Server ready")
})

app.listen(4000, () => {
  console.log("Latom-bot")
})

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);
});

client.on("messageCreate", (message) => {
  if (message.content === "uwu") {
    uwu(message);
  } else if (message.content.includes("uwu")) {
    message.react("🤍");
  }
  if (message.content.includes("-github")) {
    github(message);
  }
  if (message.content === "f" || message.content === "F"){
   paidRespects(message)
  }
  if (message.content === "-help"){
    help(message)
  }
});

client.login(token);
