const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.login(process.env.TOKEN);

app.use(express.json());

// API-Endpunkt, der die Belohnung beansprucht und die Rolle zuweist
app.post('/api/claim-reward', async (req, res) => {
  try {
    const discordUserId = req.body.userId; // Der Benutzer-ID, der die Rolle erhalten soll

    const guild = await client.guilds.fetch(process.env.GUILD_ID); // Holen des Servers
    const member = await guild.members.fetch(discordUserId);

    if (!member) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Rolle hinzufügen
    const role = guild.roles.cache.find(role => role.name === "Achievements Hunter");
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role not found' });
    }

    await member.roles.add(role);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
