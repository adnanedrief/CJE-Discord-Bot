
/* 
In  config.json , You should fill  : 
  - The Channel Name not the Channel ID
  - The Server ID not the Server Name
  - The roles Name and not the roles ID's
  - AuthorizedRole, it's the role authorized to use bot commands
  - RolesToGive, it's the list of roles to assign for the new member of the server
*/

const Discord = require('discord.js');
const config = require('./config.json'); // before setup make sure config.json has been filled in
// Create a new client instance
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "DIRECT_MESSAGES", "GUILD_MESSAGES"] }); // My discord bot

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

  const channel = client.channels.cache.find(channel => channel.name === config.WelcomeChannel);  // channel can be choosen via name
  const channel2 = client.channels.cache.find(channel => channel.name === config.TargetedChannel);

  const msg = `Welcome <@${member.id}> to ~ ${member.guild.name} ~, Please change your nickname to your full name and introduce yourself in  <#${channel2.id}> `;

  channel.send(msg);

  const myGuild = await client.guilds.cache.get(config.ServerID);

  console.log('Array of roles to give : ' + config.RolesToGive);

  config.RolesToGive.forEach(async (GiveThisRole) => {
    // the role can be found via name
    if (GiveThisRole != '' && GiveThisRole != ' ' && GiveThisRole != null) {
      const myRole = await myGuild.roles.cache.find(role => role.name === GiveThisRole);
      member.roles.add(myRole);
      console.log('Assigned role ==> ' + GiveThisRole + " <==");
    }

  });
});

client.on('messageCreate', message => {

  if (message.member.roles.cache.some(role => role.name === config.AuthorizedRole)) {

    if (message.content === 'ping') {

      let embed = new Discord.MessageEmbed()
        .setColor('#C69B6D')
        .setAuthor(`${client.user.username}`, client.user.displayAvatarURL(), '')
        .setTitle('🔍 Pingging ...')
        .setDescription('You are Pingging this Bot')
        .addField('⏱️ Your ping', `${Date.now() - message.createdTimestamp}ms`, true)
        .addField('⏳ Bot ping', `${Math.round(client.ws.ping)}ms`)
        .setFooter(`Requested By : ${message.author.username}`, message.author.avatarURL());

      message.channel.send({ embeds: [embed] }) // to send reply to current channel from we get our message 
    }
    if (message.content === 'uptime') {
      // client.uptime is in millseconds
      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      let embed = new Discord.MessageEmbed()
        .setColor('#C69B6D')
        .setAuthor(`${client.user.username}`, client.user.displayAvatarURL(), '')
        .addField('⏳ Uptime', `${days}d ${hours}h ${minutes}m ${seconds}s`)
        .setFooter(`Requested By : ${message.author.username}`, message.author.avatarURL());

      message.channel.send({ embeds: [embed] }) // to send reply to current channel from we get our message 
    }
  }
});

client.login(config.Token);
