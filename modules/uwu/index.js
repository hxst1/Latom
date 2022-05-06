/* eslint-disable no-plusplus */
const { MessageEmbed } = require("discord.js");

let count = 0;

const uwu = (message) => {
  count++;
  const msg = new MessageEmbed()
    .setTitle(`total uwu's:  ${count}`)
    .setColor("#FF1493");
  message.channel.send({ embeds: [msg] });
};

module.exports = uwu;

