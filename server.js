// Verwende 'import' anstelle von 'require'
import express from 'express';
import fetch from 'node-fetch'; // Hier auch 'import' verwenden

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Discord-API-Token und andere Daten
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
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        scope: 'identify',
    });

    try {
        const response = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
            method: 'POST',
            body,
        });
        const data = await response.json();
        
        if (data.access_token) {
            return res.json({ access_token: data.access_token });
        } else {
            return res.status(400).json({ error: 'Failed to get access token' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.post('/assignRole', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    
    if (!token) {
        return res.status(400).json({ error: 'Token missing' });
    }

    try {
        // Discord API Aufruf um den Benutzernamen zu bekommen
        const userData = await fetch(`${DISCORD_API_URL}/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => response.json());

        const guildID = '1269311377105748162'; // Deine Server-ID
        const roleID = '1367584279583916052';  // Deine Role-ID
        const userID = userData.id;

        const addRoleResponse = await fetch(`${DISCORD_API_URL}/guilds/${guildID}/members/${userID}/roles/${roleID}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            }
        });

        if (addRoleResponse.ok) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: 'Failed to assign role' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to assign role' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
