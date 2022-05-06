const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");

const github = async (message) => {
  const user = message.content.replace("-github", "").trim();
  try {
    const { data } = await axios.get(`https://api.github.com/users/${user}`);
    const msg = new MessageEmbed()
      .setTitle(`${data.login}` ?? "\u200b")
      .setAuthor({
        name: data.name,
      })
      .setThumbnail(data.avatar_url ?? "\u200b")
      .setURL(data.html_url ?? "\u200b")
      .setDescription(data.bio ?? "\u200b")
      .addFields({
        name: `------------------------------`,
        value: `Followers: ${data.followers} | Following: ${data.following}`,
        inline: false,
      })
      .setColor("#FF1493");
    message.channel.send({ embeds: [msg] });
  } catch (error) {
    const msg = new MessageEmbed()
      .setTitle(`@${message.author.username} - ERROR: Enter a valid command`)
      .setColor("#C70039");
    message.channel.send({ embeds: [msg] });
  }
};

module.exports = github;
