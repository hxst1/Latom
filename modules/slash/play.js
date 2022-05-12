const { SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Loads songs from youtube")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Load a single song from a url")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The song's url")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Loads a playlist of song from a url")
        .addStringOption((option) =>
          option.setName("url").setDescription("The playlist's url")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for song based on privded keywords")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("The search keywords")
            .setRequired(true)
        )
    ),

  run: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel)
      return interaction.editReply(
        "You need to be in a voice channel to use this command"
      );

    const queue = await client.player.createQueue(interaction.guild);
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    const embed = new MessageEmbed();

    if (interaction.option.getSubcommand() === "song") {
      const url = interaction.option.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });
      if (result.track.length === 0) return interaction.editReply("No results");

      const song = result.tracks[0];
      await queue.addTrack(song);
      embed
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the Queue`
        )
        .setThumbnail(song.thumnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    } else if (interaction.option.getSubcommand() === "playlist") {
      const url = interaction.option.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });
      if (result.track.length === 0) return interaction.editReply("No results");

      const { playlist } = result;
      await queue.addTracks(result.tracks);
      embed
        .setDescription(
          `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** has been added to the Queue`
        )
        .setThumbnail(playlist.thumnail);
    } else if (interaction.option.getSubcommand() === "search") {
      const url = interaction.option.getString("searchterms");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });
      if (result.track.length === 0) return interaction.editReply("No results");

      const song = result.tracks[0];
      await queue.addTracks(song);
      embed
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the Queue`
        )
        .setThumbnail(song.thumnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }
    if (!queue.playing) await queue.play();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};