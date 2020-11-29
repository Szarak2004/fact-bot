////////////////////////////////////////////////////////////////
/*                 MAKING IT STAY ALIVE PART                  */
////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

////////////////////////////////////////////////////////////////
/*                     DISCORD.JS PART                        */
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
/*                          Setup                             */
////////////////////////////////////////////////////////////////
require("dotenv").config();
const token = process.env.token;
const rp = require("request-promise")
const Discord = require('discord.js')
const { Client, MessageAttachment } = require('discord.js');
const client = new Client();
const db = require('quick.db')
const ff = require('ffmpeg-static')
const { meme } = require('memejs')
const opus = require('@discordjs/opus')
var NoiseMap = require('noise-map');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')

const fizres = ["Nie licz na to.",
  "Moja odpowiedź brzmi nie.",
  "Według moich źródeł - nie.",
  "Z mojej perspektywy - niezbyt.",
  "Bardzo wątpliwe.",
  "Na 100% nie.",
  "W podstawówce? Tak. Z normalnym nauczycielem? Tak. W zwykłym liceum? Tak. Z Janiną Kulą? Niezbyt...",
  "Nawet gdybym chciał to i tak nie będzie fajna.",
  "Raczej nie.",
  "Oczywiście, że nie.",
  "Niestety moja odpowiedź brzmi: nie."];

////////////////////////////////////////////////////////////////
/*                         On ready                           */
////////////////////////////////////////////////////////////////
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("olimpiadzie wiedzy o Afryce", {
    type: "COMPETING",
    url: "https://stats.uptimerobot.com/lDgRRUoqNX"
  });
  // Making sure Fact's current number in the database isn't 0
  let factCount = async function() {
    await db.get("facts.count")
  }
  if (factCount == 0 || factCount == null) {
    db.set("facts.count", 1)
  }

})

////////////////////////////////////////////////////////////////
/*                     Messages/commands                      */
////////////////////////////////////////////////////////////////
client.on('message', async message => {

  // Setting every check up
  const prefix = "!";
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  // Assigning command as a variable
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  // Fact command
  if (cmd == "fact") {
    message.delete();
    let facturi = "https://uselessfacts.jsph.pl/random.json?language=en";
    rp(facturi).then(async function(body) {
      let factCount = await db.get("facts.count");
      body = JSON.parse(body);
      message.channel.send("```" + factCount + ". " + body.text + "```")
      db.add("facts.count", 1)
    }).catch(function(err) {
      message.channel.send("Wysyłasz wiadomości za szybko!").then(newMessage => newMessage.delete({ timeout: 5000 }).catch(function(err) {
        client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
      }))
    })
  }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  // Daily command
  if (cmd == "daily") {
    message.delete();
    let dailyuri = "https://coronavirus-19-api.herokuapp.com/countries/Poland"
    rp(dailyuri).then(async function(body) {
      body = await JSON.parse(body);
      message.channel.send("Liczba dzisiejszych zakażeń: " + body.todayCases)
    }).catch(function(err) {
      client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
    })
  }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  // Meme command
  if (cmd == "meme") {
    message.delete();
    meme(async function(err, data) {
      if (err) return message.channel.send("Zb");
      let sendurl = data.url;
      message.channel.send(sendurl)
    });
  }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  // Meme Song Play
  if (cmd === "lel") {
    message.delete();
    if (!message.member.hasPermission('MUTE_MEMBERS')) {
      message.channel.send("Aby użyć tej komendy musisz być na kanale głosowym!").then(newMessage => newMessage.delete({ timeout: 5000 }).catch(function(err) {
        client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
      }))
      return;
    }
    var VC = message.member.voice.channel;
    if (!VC)
      message.channel.send("Aby użyć tej komendy musisz być na kanale głosowym!").then(newMessage => newMessage.delete({ timeout: 5000 }).catch(function(err) {
        client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
      })
      )
    VC.join()
      .then(connection => {
        const dispatcher = connection.play(require("path").join(__dirname, './prank.mp3'));
        dispatcher.on("end", end => {
          VC.leave()
        });
      })
      .catch(console.error);
  };
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  // Meme Song Stop
  if (cmd === "feku") {
    message.delete();
    if (!message.member.hasPermission('MUTE_MEMBERS')) {
      message.channel.send("Nie masz permisji aby użyć tej komendy!").then(newMessage => newMessage.delete({ timeout: 5000 }).catch(function(err) {
        client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
      }))
      return;
    }
    var VC = message.member.voice.channel;
    if (!VC)
      message.channel.send("Aby użyć tej komendy musisz być na kanale głosowym!").then(newMessage => newMessage.delete({ timeout: 5000 }).catch(function(err) {
        client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
      }))
    VC.leave()

  };
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  // Purge command
  if (cmd === "purge") {
    message.delete();
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.channel.send("Nie masz permisji aby użyć tej komendy!").then(newMessage => newMessage.delete({ timeout: 5000 }).catch(function(err) {
        client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
      }))
      return;
    }
    let numcheck = parseInt(args.join(""))
    if (numcheck == "" || !Number.isInteger(numcheck) || numcheck < 0 || numcheck > 99) {
      message.channel.send("Użycie: !purge [1-100]").then(newMessage => newMessage.delete({ timeout: 5000 }).catch(function(err) {
        client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
      }))
      return;
    }
    message.channel.bulkDelete(numcheck)
  };
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  if (cmd === "isphysicscool?") {
    const returnmessage = fizres[Math.floor(Math.random() * fizres.length)];
    message.channel.send(returnmessage).catch(function(err) {
      client.channels.cache.get(`774241128454029353`).send(`ERR: ${err}`)
    })
  }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  if (cmd === "genmap") {
    message.delete();
    var generator = new NoiseMap.MapGenerator();
    var heightmap = generator.createMap(400, 200, { type: 'perlin' });
    const canvas = createCanvas(800, 400)
    const context = canvas.getContext('2d')
    heightmap.draw(context, 800, 400, NoiseMap.STYLE.REALISTIC);
    const buffer = canvas.toBuffer('image/png')
    const attachment = new MessageAttachment(buffer);
    message.channel.send(attachment);
    return;
  }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  if (cmd === "warn") {
        if (!message.member.roles.cache.has("781459696884252722")) {
      return message.channel.send(
        "Nie masz odpowiednich uprawnień, aby użyć tej komendy!"
      );
    }

    //znalezienie osoby do warna
    const user = message.mentions.members.first();

    //sprawdzanie czy osoba istnieje
    if (!user) {
      return message.channel.send("Użycie: !warn @oznaczenie <powód>"); //tutaj zmień prefix!
    }

    //sprawdzanie czy oznaczony został bot
    if (user.id === client.user.id) {
      return message.channel.send("Nie możesz dodać warna botowi!");
    }

    const reason = args.slice(1).join(" ").toString();

    //sprawdzenie czy dodany jest powód
    if (!reason) {
      return message.channel.send("Użycie: !warn @oznaczenie <powód>"); //tutaj też zmień prefix
    }

    //warny w quick.db
    let warningCount = db.get(
      `warnings_${message.guild.id}_${user.id}.warnCount`
    );
    let warnings = db.get(`warnings_${message.guild.id}_${user.id}.warns`);

    if (warningCount === 5) {
      return message.channel.send(
        `${message.mentions.users.first().username} osiągnął/nęła już 5 warnów!`
      );
    }

    //dodanie warna
    if (warningCount === null) {
      db.push(`warnings_${message.guild.id}_${user.id}.warns`, reason);
      db.set(`warnings_${message.guild.id}_${user.id}.warnCount`, 1);
      user.send(
        `Dostałeś warna na serwerze **${message.guild.name}** za ${reason}!`
      );
      await message.channel.send(
        `Dodano warna użytkownikowi **${
          message.mentions.users.first().username
        }** za ${reason}`
      );
    } else if (warningCount !== null) {
      db.push(`warnings_${message.guild.id}_${user.id}.warns`, reason);
      db.set(
        `warnings_${message.guild.id}_${user.id}.warnCount`,
        warnings.length
      );
      user.send(
        `Dostałeś warna na serwerze **${message.guild.name}** za ${reason}`
      );
      await message.channel.send(
        `Dodałeś warna użytkownikowi **${
          message.mentions.users.first().username
        }** za ${reason}`
      );
    }
  }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  if(cmd === "warncount") {
    if (!message.member.roles.cache.has("781459696884252722")) {
      return message.channel.send(
        "Nie masz odpowiednich uprawnień, aby użyć tej komendy!"
      );
    }

    const user = message.mentions.members.first();

    if (!user) {
      return message.channel.send("Użycie: !warncount @oznaczenie"); //tutaj zmień prefix!
    }

    //sprawdzanie czy oznaczony został bot
    if (user.id === client.user.id) {
      return message.channel.send("Boty nie mogą mieć warnów!");
    }

    let warningArray = db.get(`warnings_${message.guild.id}_${user.id}.warns`);
    //sprawdzanie czy użytkownik ma jakieś warny
    if (warningArray === undefined || warningArray === null) {
      return message.channel.send(
        `Użytkownik **${
          message.mentions.users.first().username
        }** nie posiada żadnych warnów!`
      );
      //jeśli ma 1 warn
    } else {
      let warnings = warningArray.length;
      if (warnings === 0) {
        return message.channel.send(
          `Użytkownik **${
            message.mentions.users.first().username
          }** nie posiada żadnych warnów!`
        );
      }
      if (warnings === 1) {
        return message.channel.send(
          `Użytkownik **${
            message.mentions.users.first().username
          }** posiada 1 warn!`
        );
        //jeśli ma więcej warnów
      }
      if (warnings === 5) {
        return message.channel.send(
          `Użytkownik **${
            message.mentions.users.first().username
          }** posiada 5 warnów!`
        );
        //jeśli ma więcej warnów
      } else
        return message.channel.send(
          `Użytkownik **${
            message.mentions.users.first().username
          }** posiada **${warnings}** warny!`
        );
    }
  }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  if(cmd=="warndelete") {
    if (!message.member.roles.cache.has("781459696884252722")) {
      return message.channel.send(
        "Nie masz odpowiednich uprawnień, aby użyć tej komendy!"
      );
    }

    //znalezienie osoby do warna
    const user = message.mentions.members.first();

    //sprawdzanie czy osoba istnieje
    if (!user) {
      return message.channel.send(
        "Użycie: !warndelete @oznaczenie <numer warna z komendy !warndisplay>"
      ); //tutaj zmień prefix!
    }

    //sprawdzanie czy oznaczony został bot
    if (user.id === client.user.id) {
      return message.channel.send("Boty nie mogą mieć warnów!");
    }

    if (message.author.id === user.id) {
      return message.channel.send("Nie możesz usuwać swoich warnów!");
    }

    let warningCount = db.get(
      `warnings_${message.guild.id}_${user.id}.warnCount`
    );

    if (warningCount === null) {
      return message.channel.send(
        `Użytkownik **${
          message.mentions.users.first().username
        }** nie posiada żadnych warnów!`
      );
    }

    let warnNumber = args.slice(1);
    warnNumber = Number(warnNumber);

    if (!warnNumber) {
      return message.channel.send(
        "Użycie: !warndelete @oznaczenie <numer warna z komendy !warndisplay>"
      );
    }

    if (warnNumber <= 0 || warnNumber > 5) {
      return message.channel.send(
        "Użycie: !warndelete @oznaczenie <numer warna z komendy !warndisplay>"
      );
    }

    warnNumber--;

    let warningsArray = db.get(`warnings_${message.guild.id}_${user.id}.warns`);
    let warnReason = warningsArray[warnNumber];
    warningsArray.splice(warnNumber, 1);
    db.set(`warnings_${message.guild.id}_${user.id}.warns`, warningsArray);
    db.subtract(`warnings_${message.guild.id}_${user.id}.warnCount`, 1);
    return message.channel.send(
      `Usunięto warna:\n**${warnReason}**\nużytkownikowi **${
        message.mentions.users.first().username
      }**!`
    );
  }
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
  if(cmd=="warndisplay") {
    if (!message.member.roles.cache.has("781459696884252722")) {
      return message.channel.send(
        "Nie masz odpowiednich uprawnień, aby użyć tej komendy!"
      );
    }

    //znalezienie osoby do warna
    const user = message.mentions.members.first();

    //sprawdzanie czy osoba istnieje
    if (!user) {
      return message.channel.send("Użycie: !warndisplay @oznaczenie"); //tutaj zmień prefix!
    }

    //sprawdzanie czy oznaczony został bot
    if (user.id === client.user.id) {
      return message.channel.send("Boty nie mogą mieć warnów!");
    }

    let warnings = db.get(`warnings_${message.guild.id}_${user.id}.warns`);
    if (warnings === null || warnings === undefined || warnings.length <= 0) {
      return message.channel.send(
        `Użytkownik **${
          message.mentions.users.first().username
        }** nie posiada żadnych warnów!`
      );
    } else {
      var i;
      let warningMessage = "";
      for (i = 0; i < warnings.length; i++) {
        warningMessage += i + 1 + ". " + warnings[i] + "\n";
      }
      return message.channel.send(
        `Warny użytkownika **${
          message.mentions.users.first().username
        }**: \n ${warningMessage}`
      );
    }
  }
})
// Bot login
client.login(token);
