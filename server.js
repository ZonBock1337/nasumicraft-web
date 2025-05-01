import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Discord-API-Token und andere Daten
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const BOT_TOKEN = process.env.BOT_TOKEN;
const REDIRECT_URI = 'https://mc.nasumicraft.de/secrets/reward';
const DISCORD_API_URL = 'https://discord.com/api/v10';

app.get('/secrets/reward', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Kein Code erhalten');
  }

  try {
    // 1. Holen wir uns das Access-Token mit dem erhaltenen Code
    const tokenResponse = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        scope: 'identify',
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(400).send('Fehler beim Abrufen des Tokens');
    }

    // 2. Holen wir uns die Benutzerinformationen mit dem Access-Token
    const userResponse = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    // 3. Rolle zuweisen
    const guildID = '1269311377105748162'; // Deine Server-ID
    const roleID = '1367584279583916052';   // Deine Role-ID
    const userID = userData.id;

    const roleResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildID}/members/${userID}/roles/${roleID}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });

    if (roleResponse.ok) {
      return res.send('Rolle erfolgreich zugewiesen!');
    } else {
      return res.status(400).send('Fehler beim Zuweisen der Rolle');
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Serverfehler');
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
