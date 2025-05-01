import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ENV-Daten
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.SECRET_TOKEN;
const BOT_TOKEN = process.env.BOT_TOKEN;
const REDIRECT_URI = 'https://mc.nasumicraft.de/secrets/reward';
const DISCORD_API_URL = 'https://discord.com/api/v10';

app.post('/getToken', async (req, res) => {
  const { code } = req.body;

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
    scope: 'identify'
  });

  try {
    const response = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
      method: 'POST',
      body
    });
    const data = await response.json();

    if (data.access_token) {
      res.json({ access_token: data.access_token });
    } else {
      res.status(400).json({ error: 'Failed to get access token' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfehler beim Token' });
  }
});

app.post('/assignRole', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'Token fehlt' });

  try {
    const userData = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json());

    if (!userData.id) return res.status(400).json({ error: 'Benutzer ungültig' });

    const guildID = '1269311377105748162'; // DEIN SERVER
    const roleID = '1367584279583916052';  // DEINE ROLLE
    const userID = userData.id;

    const roleRes = await fetch(`${DISCORD_API_URL}/guilds/${guildID}/members/${userID}/roles/${roleID}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (roleRes.ok) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Rolle konnte nicht zugewiesen werden' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Rollen geben' });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
