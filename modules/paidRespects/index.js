/* eslint-disable no-plusplus */
const { MessageEmbed } = require("discord.js");

const paidRespects = (message) => {
  const msg = new MessageEmbed()
    .setTitle(`${message.author.username} has paid their respects. Latom 🌸`)
    .setColor("#FF1493");
  message.channel.send({ embeds: [msg] });
};

module.exports = paidRespects;