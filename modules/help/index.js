const { MessageEmbed } = require("discord.js");

const help = async (message) => {
  try {
    const msg = new MessageEmbed()
      .setTitle(`Latom commands help`)
      .setDescription(`**commands** 🤍`)
      .addFields(
        {
          name: `-github username`,
          value: `It will send you your github profile`,
          inline: false,
        },
        {
          name: `uwu`,
          value: `He will answer you with the total of uwu's`,
          inline: false,
        },
        {
          name: `f`,
          value: `To pay respects`,
          inline: false,
        },
        {
          name: `/`,
          value: `To see the music bot commands`,
          inline: false,
        }
      )
      .setColor("#FF1493");
    message.channel.send({ embeds: [msg] });
  } catch (error) {
    const msg = new MessageEmbed()
      .setTitle(`@${message.author.username} - ERROR: Enter a valid command`)
      .setColor("#C70039");
    message.channel.send({ embeds: [msg] });
  }
};

module.exports = help;
