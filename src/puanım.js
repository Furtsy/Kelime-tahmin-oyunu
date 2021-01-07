const Discord = require("discord.js");
const db = require('quick.db');

exports.run = async (client, message, args) => {
let puan = db.get(`puan_${message.guild.id}_${message.author.id}`)
if(puan == null) puan = 0
message.channel.send('Puanın: ' + puan)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["puanım", "puan"],
  permLevel: 0
};

exports.help = {
  name: 'puan',
  description: 'Puanını gösterir.',
  usage: 'puan'
};
