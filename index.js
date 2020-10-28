 // Import discord.js and create the client
    require("dotenv").config();
    const token = process.env.token;
    const rp = require("request-promise")
    const Discord = require('discord.js')
    const client = new Discord.Client();
    const db = require('quick.db')
    
    // Register an event so that when the bot is ready, it will log a messsage to the terminal
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      client.user.setActivity("me being developed :)", { type: "WATCHING" });
      let factCount = async function() {
          await db.get("facts.count")
      }
      if(factCount==0 || factCount==null) {
          db.set("facts.count", 1)
      }
    })
    
    // Register an event to handle incoming messages
    client.on('message', async msg => {

        async function getAPI(url) {
            await rp(url).then(async function(body) {
                let factCount = await db.get("facts.count");
                body = JSON.parse(body);
                msg.channel.send(factCount + ". " + body.text)
                db.add("facts.count", 1)
            }).catch(function(err){
                console.log(`ERR: ${err}`)
            })
        }
        const prefix = "!";

        if (msg.author.bot) return;
        if (!msg.guild) return;
        if (!msg.content.startsWith(prefix)) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if(cmd == "fact") {
            const uri = "https://uselessfacts.jsph.pl/random.json?language=en";
            getAPI(uri);
        }
    })
    
    // client.login logs the bot in and sets it up for use. You'll enter your token here.
    client.login(token);