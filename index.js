/* 
In  config.jso , You should fill  : 
  - The Channel Name not the Channel ID
  - The Server ID not the Server Name
  - The roles Name and not the roles ID's
  - AuthorizedRole, it's the role authorized to use bot commands
  - RoleToGive, it's the role to give to new member
*/

const Discord = require('discord.js');
const { Token, TargetedChannel, ServerID, RoleToGive, AuthorizedRole } = require('./config.json'); // before setup make sure config.json has been filled in
// Create a new client instance
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES", "GUILD_MESSAGES"] }) // My discord bot

client.once('ready', () => {
  console.log('Ready !!! Now i\'m running');
  client.user.setPresence({
    activities:
      [
        {
          name: 'Supporting The ⛩️ CJE FAMILY ⛩️ ',
          type: 'PLAYING'
        }
      ],
    status: 'online'
  });
});

client.on('guildMemberAdd', async member => {
  const channel = client.channels.cache.find(channel => channel.name === TargetedChannel);  // channel can be choosen via name
  const channel2 = client.channels.cache.find(channel => channel.name === "bots");

  const msg = `Welcome to ~ ${member.guild.name} ~ : <@${member.id}> , GO TO channel <#${channel2.id}>  and present your self`;

  channel.send(msg);

  const myGuild = await client.guilds.cache.get(ServerID);
  const myRole = await myGuild.roles.cache.find(role => role.name === RoleToGive); // the role can be found via name
  member.roles.add(myRole);
});

client.on('messageCreate', message => {
  // message.channel.send('pong');
  console.log(message.channel);
  if (message.member.roles.cache.some(role => role.name === AuthorizedRole)) {

    const channel = client.channels.cache.find(channel => channel.name === TargetedChannel);  // channel can be choosen via name
    if (message.content === 'ping') {

      let embed = new Discord.MessageEmbed()
        .setColor('#C69B6D')
        .setAuthor(`${client.user.username}`, client.user.displayAvatarURL(), '')
        .setTitle('🔍 Pingging ...')
        .setDescription('You are Pingging this Bot')
        .addField('⏱️ Your ping', `${Date.now() - message.createdTimestamp}ms`,true)
        .addField('⏳ Bot ping', `${Math.round(client.ws.ping)}ms`)
        .setFooter(`Requested By : ${message.author.username}`, message.author.avatarURL());

      channel.send({ embeds: [embed] })
    }
    if (message.content === 'uptime') {
      // client.uptime is in millseconds
      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      let embed = new Discord.MessageEmbed()
        .setColor('#C69B6D')
        .setAuthor(`${client.user.username}`,client.user.displayAvatarURL(), '')
        .addField('⏳ Uptime', `${days}d ${hours}h ${minutes}m ${seconds}s`)
        .setFooter(`Requested By : ${message.author.username}`, message.author.avatarURL());

      channel.send({ embeds: [embed] })
    }
  }
});

client.login(Token);