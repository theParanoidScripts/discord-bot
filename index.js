// jshint esversion:8

const Discord = require("discord.js");
const { prefix } = require("./config.json");
const randNumber = require("./randNumber.js");
const GphApiCLient = require("giphy-js-sdk-core");

const client = new Discord.Client();
require("dotenv").config();
const giphy = GphApiCLient(process.env.API_KEY);

const token = process.env.TOKEN;

client.once("ready", () => console.log("ready!"));

client.on("message", (message) => {
  // message.channel.send("works");

  if (message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"])) {
    if (message.content.startsWith(`${prefix}kick`)) {
      const member = message.mentions.members.first();

      member.kick().then((member) => {
        giphy
          .search("gifs", { q: "fail" })
          .then((res) => {
            const randNo = randNumber.randNo(res);

            message.channel.send(
              `: wave : ${member.displayName} has been kicked! Goodbye!`,
              {
                files: [randNo.images.fixed_height.url],
              }
            );
          })
          .catch((err) => {
            console.log(err);

            message.channel.send("Error in getting");
          });
      });
    }
  }

  if (message.content.startsWith(`${prefix}gif`)) {
    giphy
      .search("gifs", { q: "funny" })
      .then((res) => {
        const randNo1 = randNumber.randNo(res);

        message.channel.send(`Here is a gif for you!`, {
          files: [randNo1.images.fixed_height.url],
        });
      })
      .catch((err) => {
        console.log(err);
        message.channel.send("Error in fetching");
      });
  }

  if (message.content.startsWith(`${prefix}help`)) {
    const helpMessage = `I respond to these commands:\n\n=> !gif for a random gif.\n=> !meme for a random meme.\n=> !kick to kick a user from the server.`;
    message.channel.send(helpMessage);
    return;
  }

  if (message.content.startsWith(`${prefix}meme`)) {
    getMeme()
      .then((data) => {
        // console.log(data.url);
        message.channel.send(`Here is a meme for you\n${data.url}`);
      })
      .catch((err) => {
        console.log(err);
        message.channel.send("Error in fetching");
      });
  }

  if (message.content === "what is my avatar") {
    // Send the user's avatar URL
    message.reply(message.author.displayAvatarURL());
  }
});

client.on("guildMemberAdd", (member) => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "member-log"
  );
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

async function getMeme() {
  let response = await fetch(`https://meme-api.herokuapp.com/gimme`);
  let data = await response.json();
  return data;
}

client.login(token);
