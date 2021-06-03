const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const db = require("quick.db");
const fetch = require('node-fetch');

client.conf = {
"token": "token",
 "pref": "!",
  "own": "idniz",
  "oynuyor": "oyunu",
  "durum": "online"
}

client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(client.conf.pref)) return;
  let command = message.content.split(" ")[0].slice(client.conf.pref.length);
  let params = message.content.split(" ").slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
})

client.on("ready", () => {
  console.log(`Bütün komutlar yüklendi, bot çalıştırılıyor...`);
  console.log(`${client.user.username} ismi ile Discord hesabı aktifleştirildi!`);
  client.user.setStatus(client.conf.durum);
  client.user.setActivity(client.conf.oynuyor);
  console.log(`Oynuyor ayarlandı!`);
})

client.on('message', async(message) => {
if(message.author.bot) return;
  if(message.channel.id !== '719188846939734127') return;
if(message.content.startsWith('.')) return;
if(message.content.split(" ").length > 1) return message.channel.send('kelime ya bruh').then(msg => {
                msg.delete({ timeout: 5000})
                message.delete()
            })
let kelime = db.get(`son_${message.guild.id}`)
let kelimeler = db.get(`kelimeler_${message.guild.id}`)

let kişi = db.get(`klm_${message.guild.id}`)
if(kişi == message.author.id) return message.channel.send('en son zaten sen yazmışsın -_-').then(msg => {
                msg.delete({ timeout: 5000})
                message.delete()
            })

if(kelime == null) {
let random = String.fromCharCode(65+Math.floor(Math.random() * 26))
let son = random.charAt(random.length-1)
db.set(`son_${message.guild.id}`, son)
message.channel.send('Oyun **' + son + '** harfi ile başladı')
} 

if(kelime.toLowerCase() !== message.content.charAt(0)) return message.channel.send('en son yazılan kelime **'+ kelime + '** ile bitmiş üzgünüm :(').then(msg => {
                msg.delete({ timeout: 5000})
                message.delete()
            })
if(!kelimeler) return db.push(`kelimeler_${message.guild.id}`, message.content)
if(kelimeler.includes(message.content)) return message.channel.send('Bu kelime zaten yazılmış başka bir şey dene :/').then(msg => {
                msg.delete({ timeout: 5000})
                message.delete()
    })



const api = await fetch(`https://sozluk.gov.tr/gts?ara=${encodeURI(message.content)}` )
      .then(response => response.json());
if(api.error) return message.channel.send('Yazdığın kelimeyi tdk da bulamadım :(').then(msg => {
                msg.delete({ timeout: 5000})
                message.delete()
db.subtract(`puan_${message.guild.id}_${message.author.id}`, 1)
            })
 
if(message.content.charAt(message.content.length-1) === 'ğ'.toLowerCase()) return message.channel.send('sonu ğ ile bitmemeli.').then(msg => {
                msg.delete({ timeout: 5000})
                message.delete()
  })
 
db.push(`kelimeler_${message.guild.id}`, message.content)
db.set(`son_${message.guild.id}`, message.content.charAt(message.content.length-1))
db.set(`klm_${message.guild.id}`, message.author.id)
db.add(`puan_${message.guild.id}_${message.author.id}`, 2)
message.react('🥲')
})



var prefix = client.conf.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./src/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklenmeye hazır. Başlatılıyor...`);
  files.forEach(f => {
    let props = require(`./src/${f}`);
    log(`Komut yükleniyor: ${props.help.name}'.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./src/${command}`)];
      let cmd = require(`./src/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./src/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./src/${command}`)];
      let cmd = require(`./src/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.yetkiler = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if(message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if(message.member.hasPermission("MANAGE_ROLES")) permlvl = 2;
  if(message.member.hasPermission("MANAGE_CHANNELS")) permlvl = 3;
  if(message.member.hasPermission("KICK_MEMBERS")) permlvl = 4;
  if(message.member.hasPermission("BAN_MEMBERS")) permlvl = 5;
  if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 6;
  if(message.author.id === message.guild.ownerID) permlvl = 7;
  if(message.author.id === client.conf.own) permlvl = 8;
  return permlvl;
};



client.login(client.conf.token)


