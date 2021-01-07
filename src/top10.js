const Discord = require("discord.js");
const db = require('quick.db');

exports.run = async (client, message, args) => {
        let puan = db.all().filter(data => data.ID.startsWith(`puan`)).sort((a, b) => b.data - a.data)
        puan.length = 10;
        var ğ = "";
        for (var i in puan) {
            ğ += `**${puan.indexOf(puan[i])+1}.** <@${puan[i].ID.split('_')[2]}> - ${puan[i].data} puan\n`;
        }
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Sunucuda en fazla puana sahipler`, message.guild.iconURL())
        .setColor('RANDOM')
        .setDescription(ğ)
        .setFooter(client.user.tag, client.user.displayAvatarURL())
        .setTimestamp()
        message.channel.send(embed);
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["top10"],
  permLevel: 0
};

exports.help = {
  name: 'top10',
  description: 'Top10 u gösterir.',
  usage: 'top10'
};
