const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot ist online als ${client.user.tag}`);
});

client.login(TOKEN);

// Ping-Seite für UptimeRobot
app.get("/", (req, res) => {
  res.send("Bot läuft!");
});

app.listen(3000, () => console.log("Webserver läuft"));
